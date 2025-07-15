# Time Planner App – 全端開發計畫

（React Native Expo × Firebase Serverless × Gemini API）

---

## 1. 專案總覽

| 面向    | 技術／平台                                                                     | 核心任務                                                   |
| ----- | ------------------------------------------------------------------------- | ------------------------------------------------------ |
| UI／UX | **Lovable AI**（已完成第一版）                                            | 視覺稿、元件規格、互動稿                                           |
| 行動端   | **React Native 0.74 + Expo SDK 50 + TypeScript**                          | 依 Lovable 樣式實作；透過 Firebase SDK 存取資料；呼叫 Cloud Functions |
| 後端    | **Firebase（Functions、Firestore、Auth、FCM、Cloud Tasks）**                    | 伺服器邏輯、AI 排程、通知、定時任務                                    |
| AI    | **Gemini 2.5 Flash Pre-Thinking**（即時排程）<br>**Gemini 2.0 Pro Pre**（語音／NLP） | 智慧排程、語音文字解析                                            |

---

## 2. 技術棧

### 2.1 前端技術棧

| 類別           | 選定技術                            | 說明                                |
| ------------ | ------------------------------- | --------------------------------- |
| UI Framework | React Native 0.74 + Expo SDK 50 | 支援 Android / iOS                  |
| UI           | `twrnc` (Tailwind RN)           | 依 Lovable Token 轉換為 Utility Class |
| 路由           | `@react-navigation/native`      | Stack + Bottom Tabs 主流程導航      |
| 狀態管理         | `zustand`                       | 輕量本地狀態，本地快取視圖狀態（矩陣拖曳座標等） |
| 資料存取         | `firebase` v10 SDK + `@react-query-firebase` | Firestore 線上／離線同步            |
| 圖表           | `victory-native`                | 完成率、熱點圖等                    |
| 地圖           | `react-native-maps`（後續擴充）     | 任務地點                            |
| 語音           | Expo `Speech` 或上傳 Cloud Storage → Gemini Pro | 解析任務草稿                        |

### 2.2 後端技術棧（Firebase）

| 模組                              | 功能                                                          | 實作重點                     |
| ------------------------------- | ----------------------------------------------------------- | ------------------------ |
| Firestore                       | 任務、排程、類別、用戶偏好、番茄鐘日誌                                         | 使用集合，配合索引                |
| Authentication                  | Email／Google 登入                                             | 強制登入後才可任何讀寫              |
| Cloud Functions (TypeScript 18) | smartSchedule、parseVoiceText、getWeeklyAnalytics、reminderJob | Callable Fn；HTTP Fn（FCM） |
| Cloud Tasks + Scheduler         | 對未來排程建立提醒任務                                                 | 觸發 Pub/Sub 再送 FCM        |
| FCM                             | 行動端推播                                                       | 通知任務開始、排程調整              |
| Cloud Storage（暫無）               | 保留日後上傳語音檔或匯出備份                                              |                          |

---

## 3. 系統架構

### 3.1 前端架構

#### 目錄結構

```
/mobile-app
 ├─ src/
 │   ├─ components/  // 封裝 Lovable 元件
 │   ├─ screens/     // Home, Tasks, Planner, ...
 │   ├─ navigation/  // stack.tsx, tabs.tsx
 │   ├─ stores/      // zustand
 │   ├─ api/         // firebase helpers, generated types
 │   └─ utils/
 └─ app.tsx
```

#### 導航結構

```
RootStack
 ├─ OnboardingStack (首次引導)
 ├─ MainTabs
 │    ├─ HomeStack
 │    │    └─ HomeScreen
 │    ├─ TasksStack
 │    │    ├─ TasksScreen
 │    │    └─ AddEditTaskModal
 │    ├─ PlannerStack
 │    │    └─ PlannerScreen
 │    ├─ StatsStack
 │    │    └─ StatsScreen
 │    └─ SettingsStack
 └─ VoiceTaskModal (全域)
```

### 3.2 後端架構

#### Firestore 資料模型（collection / doc）

```
users/{uid}
user_preferences/{uid}
categories/{catId}
tasks/{taskId}
schedule_blocks/{blockId}
pomodoro_logs/{logId}
```

> **索引**
>
> *   `tasks`: `userId` + `done` + `urgency`
> *   `schedule_blocks`: `userId` + `start`
> *   `categories`: `userId`

#### Security Rules v2（摘要）

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{col=tasks|categories|schedule_blocks|pomodoro_logs}/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /user_preferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### Cloud Functions 目錄與接口

```
functions/
 └─ src/
     ├─ services/
     │   └─ ai.service.ts
     ├─ jobs/
     │   └─ reminder.job.ts
     ├─ types/
     │   └─ index.ts
     └─ index.ts
```

| 函式名稱               | 觸發方式                       | 參數 (data)                   | 回傳                                   | 主要流程                                                             |
| ------------------ | -------------------------- | --------------------------- | ------------------------------------ | ---------------------------------------------------------------- |
| smartSchedule      | callable                   | `{}`                        | `{ scheduled:Array<ScheduleBlock> }` | 讀未完成任務、prefs → Gemini Flash → 寫 schedule\_blocks → 建 Cloud Tasks |
| parseVoiceText     | callable                   | `{ text:string }`           | `{ draftTask:Object }`               | Gemini Pro→解析→回傳任務草稿                                             |
| getWeeklyAnalytics | callable                   | `{ weekStartISO }`          | `{ charts:Object }`                  | 聚合完成率、番茄鐘等                                                       |
| reminderJob        | Pub/Sub (`tasks-reminder`) | `{ uid, taskId, startISO }` | void                                 | 取 FCM token → push 訊息                                            |

#### Cloud Tasks 流程

1.  `smartSchedule` 寫入 `schedule_blocks`。
2.  為每個未來區塊呼叫 Cloud Tasks API 建立提醒任務：

    ```ts
    const task = {
      url: REMINDER_ENDPOINT,
      scheduleTime: { seconds: startSeconds - 600 }, // 提前 10 分鐘
      payload: { uid, taskId, startISO }
    };
    ```

3.  Cloud Tasks 觸發 Pub/Sub 訊息，進而觸發 `reminderJob` Cloud Function → `admin.messaging().send()` 發送 FCM 推播。

---

## 4. 核心功能與流程

### 4.1 使用者流程

#### 4.1.1 首次使用 Onboarding

1.  App 啟動 → Firebase Auth 未驗證 → 進入 `OnboardingStack`。
2.  問卷填寫效率高峰、排程偏好 → 寫入 `/user_preferences/{uid}`。
3.  完成後跳轉 `MainTabs/Home`。

#### 4.1.2 新增任務

```
Home > QuickActionBar_V3.icon_addTask
  └─ AddEditTaskDialog  (預設空值)
        保存 -> firestore.collection('tasks').add()
        → Planner 未排程抽屜會即時出現新 Chip
```

#### 4.1.3 智慧排程

1.  `PlannerScreen` 右上 `btn_autoSchedule`。
2.  呼叫 `smartSchedule` Callable Function。
3.  Cloud Function 執行：Gemini Flash 進行排程運算 → 寫入 `schedule_blocks` → 建立 Cloud Tasks。
4.  回傳新排程結果 → 前端顯示 `AutoScheduleSummaryModal`。
5.  使用者「接受」 → 行事曆即時刷新。

#### 4.1.4 四象限優先排序

1.  `TasksScreen` Tab「艾森豪矩陣」。
2.  `DraggableDot` 拖曳 → `zustand` 暫存座標 → `onDragEnd` 更新 Firestore `importance`, `urgency`。
3.  React Query 使 Tasks 列表與 Planner 立即刷新。

#### 4.1.5 Pomodoro 專注

1.  進入 `PomodoroScreen` → 選中當前任務或長按 Start 彈出 `ChangeTaskDialog`。
2.  倒數結束 → Cloud Function 寫一筆 `pomodoro_logs`。
3.  前端統計畫面使用 `useFirestoreCollectionData(logs)` 聚合顯示每日完成番茄。

### 4.2 畫面對應 Lovable 元件

| 畫面       | 核心元件                                                                   | Firestore 讀寫                           |
| -------- | ---------------------------------------------------------------------- | -------------------------------------- |
| Home     | VerticalTimelineFull · ScheduleTaskCard\_NoBorder · QuickActionBar\_V3 | `tasks`, `schedule_blocks`             |
| Tasks    | TaskCard\_Manage · AddEditTaskDialog · CategorySelectFilter            | `tasks`, `categories`                  |
| Tasks 子頁 | EisenhowerMatrix\_AxisColor · DraggableDot                             | `tasks` (importance/urgency)           |
| Planner  | ScheduleCalendar · UnscheduledDrawer · btn\_autoSchedule               | `schedule_blocks`<br>`smartSchedule()` |
| Stats    | CompletionRateChart · StressHeatmap · HistoryTaskList                  | Cloud Function `getWeeklyAnalytics`    |
| Pomodoro | PomodoroDisplay · ChangeTaskDialog                                     | `pomodoro_logs`                        |
| Settings | ThemeSwitcher · ResetOnboardingBtn                                     | `user_preferences`, `Auth`             |

---

## 5. 關鍵程式碼實作

### 5.1 AI 服務封裝（functions/src/services/ai.service.ts）

```ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const flash = new GoogleGenerativeAI({
  model: "models/gemini-2.5-flash-pre-thinking",
  apiKey: process.env.GEMINI_KEY,
});
const pro = new GoogleGenerativeAI({
  model: "models/gemini-2.0-pro-pre",
  apiKey: process.env.GEMINI_KEY,
});

export async function genSchedule(prompt: string) {
  const res = await flash.generateContent({ contents:[{role:"user",parts:[{text:prompt}]}]});
  return JSON.parse(res.response.text());
}
export async function nlpVoice(text: string) {
  const p = `Extract a todo object from: "${text}". Return JSON.`;
  const res = await pro.generateContent({ contents:[{role:"user",parts:[{text:p}]}]});
  return JSON.parse(res.response.text());
}
```

### 5.2 前端與 Cloud Functions 通訊範例

```ts
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

// 呼叫智慧排程
export const callSmartSchedule = async () => {
  const fn = httpsCallable(functions, 'smartSchedule');
  const res = await fn({});
  return res.data.scheduled as ScheduleBlock[];
};

// 語音轉任務
export const parseVoiceText = async (text: string) => {
  const voice = httpsCallable(functions, 'parseVoiceText');
  const draft = (await voice({ text })).data as DraftTask;
  return draft;
};

// 任務列表資料存取範例
export const useTasks = () => {
  const q = query(collection(db, 'tasks'),
                  where('userId', '==', uid),
                  where('done', '==', false));
  return useFirestoreCollectionData(q, { idField: 'id' });
};
```

### 5.3 離線同步策略

| 情境           | 本地快取                    | 同步時機               |
| ------------ | ----------------------- | ------------------ |
| CRUD 任務 / 排程 | Firestore SDK IndexedDB | 自動；前端顯示 pending 標誌 |
| AI 排程        | 需線上                     | 若離線，提示「排程需網路」      |
| 推播           | OS 層級緩存                 | 網路恢復即接收            |

---

## 6. 開發與部署

### 6.1 開發工作流程

1.  在 `functions` 目錄執行 `roocode init api --template firebase-functions-ts` 初始化後端專案。
2.  按本文件填寫 `ai.service.ts` 與各 callable function。
3.  若需本地端測試 AI，可於 `.env` 加上 `GEMINI_KEY`。
4.  完成本藍圖，即可在 VS Code + Roocode Studio 中分階段開發、測試與部署。

### 6.2 CI/CD

1.  **行動端 (Expo)**
    *   `expo prebuild` 產生 android/ios 資料夾。
    *   GitHub Actions:
        *   Lint (`eslint .`)
        *   Jest 單元測試
        *   `expo publish` → OTA (Over-The-Air) 更新。
2.  **後端 (Firebase Functions)**
    *   `npm run lint && npm run test` under `functions/`。
    *   `firebase deploy --only functions` on main 分支。
    *   調整 Firestore 索引：`firebase firestore:indexes`。
    *   修改 Rules：`firebase deploy --only firestore:rules`。

---

## 7. 專案規劃

### 7.1 最小可行產品 (MVP) 里程碑

| Sprint | 功能        | 後端任務                           | 前端任務                |
| ------ | --------- | ------------------------------ | ------------------- |
| 1      | 資料模型＋CRUD | 建立 Firestore 集合、Security Rules | Tasks 清單增刪改         |
| 2      | 排程視圖      | ScheduleBlock CRUD Rules       | 行事曆拖曳排程             |
| 3      | AI 排程     | `smartSchedule` + Gemini Flash | Auto 排程 UI、Timeline |
| 4      | 推播        | Cloud Tasks + FCM              | 接收通知、番茄鐘紀錄          |
| 5      | 分析        | `getWeeklyAnalytics`           | Stats Page、艾森豪矩陣拖曳  |
| 6      | 語音        | `parseVoiceText` + Gemini Pro  | VoicePopup 建任務      |

### 7.2 風險評估與應對策略

| 風險類別       | 潛在風險                               | 應對策略                                                     |
| :------------- | :------------------------------------- | :----------------------------------------------------------- |
| **技術風險**   | Gemini API 回應延遲或不穩定，影響使用者體驗。 | 1. 在 Cloud Function 中設定更長的超時時間。<br>2. 設計降級機制，在 AI 服務失敗時提供手動排程選項。<br>3. 監控 API 效能，並考慮快取常用請求。 |
| **相依性風險** | `react-native-maps` 或 `victory-native` 等第三方套件存在未解決的 Bug 或停止維護。 | 1. 在開發初期進行充分的 PoC（概念驗證）。<br>2. 尋找替代方案，並將相關程式碼封裝，以便未來替換。<br>3. 鎖定穩定的套件版本。 |
| **專案管理風險** | 前後端開發進度不一致，導致整合困難。 | 1. 遵循 MVP 里程碑，確保每個 Sprint 都有可交付的整合功能。<br>2. 透過 `functions/src/types` 共享型別定義，建立契約。<br>3. 定期舉行簡短的同步會議。 |
| **成本風險**   | Firebase 或 Gemini API 的使用量超出預算。 | 1. 在 Cloud Function 中為 Gemini API 設定 per-user 配額。<br>2. 善用 Firestore 的離線快取，減少不必要的讀取。<br>3. 在 Google Cloud Console 設定預算提醒。 |

### 7.3 待辦列表

*   [ ] 建 Firestore 索引（`tasks`: `userId`+`done`、`schedule_blocks`: `userId`+`start`）。
*   [ ] 撰寫 `firestore.rules` v2。
*   [ ] 建立 `smartSchedule` Gemini Prompt 範本。
*   [ ] Cloud Tasks HTTP 端點與 FCM 權杖管理。
*   [ ] React Native 導入 Firebase AppCheck（提高安全性）。
*   [ ] Gemini API 速率與費用控管：於 Cloud Function 設定 per-user 配額。
*   [ ] Expo OTA 更新：確保版本號 (`expo.version`) 遞增。
