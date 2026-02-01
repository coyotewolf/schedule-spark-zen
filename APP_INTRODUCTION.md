# Time Planner App - 智慧時間管理應用程式

> 一款結合 AI 智慧排程、番茄鐘工作法與艾森豪矩陣的全方位時間管理工具

---

## 📋 目錄

- [專案簡介](#專案簡介)
- [核心功能](#核心功能)
- [頁面介紹](#頁面介紹)
- [技術架構](#技術架構)
- [資料模型](#資料模型)
- [安裝與執行](#安裝與執行)
- [開發指南](#開發指南)
- [未來規劃](#未來規劃)

---

## 專案簡介

### 目的

**Time Planner** 是一款專為現代忙碌人士設計的智慧時間管理應用程式。透過結合經典的時間管理方法論（艾森豪矩陣、番茄鐘工作法）與現代 AI 技術，幫助使用者：

- 🎯 **有效分類任務優先級** - 使用艾森豪矩陣區分任務的重要性與緊急性
- ⏰ **智慧排程** - AI 自動根據使用者偏好與任務特性安排最佳時間
- 🍅 **提升專注力** - 整合番茄鐘計時器，培養深度工作習慣
- 📊 **追蹤進度** - 視覺化統計報表，了解時間運用效率

### 目標使用者

- 學生：管理課業、社團活動與個人時間
- 上班族：處理工作任務、會議安排與專案進度
- 自由工作者：安排多元項目與客戶需求
- 任何希望提升時間管理效率的人

---

## 核心功能

### 1. 🏠 首頁儀表板 (Home)

- **每日名言** - 提供每日激勵語句，開啟美好的一天
- **快速操作列** - 一鍵新增任務、開始番茄鐘、查看行事曆、語音輸入
- **今日行程時間軸** - 視覺化呈現當日所有排程任務
- **本週完成率圖表** - 追蹤一週的任務完成進度

### 2. ✅ 任務管理 (Tasks)

- **任務清單視圖** - 依分類、狀態檢視所有任務
- **艾森豪矩陣視圖** - 四象限優先級分類
  - 第一象限：重要且緊急（立即處理）
  - 第二象限：重要但不緊急（計劃執行）
  - 第三象限：不重要但緊急（委派他人）
  - 第四象限：不重要且不緊急（考慮刪除）
- **時間篩選器** - 依日、週、月篩選任務
- **拖曳調整優先級** - 在矩陣中拖曳圓點快速調整任務優先級
- **任務詳情彈窗** - 點擊查看完整任務資訊

### 3. 📅 行程規劃 (Planner)

- **多視圖切換** - 日視圖、週視圖、月視圖
- **日期導航** - 快速切換檢視日期
- **未排程任務抽屜** - 查看並拖曳未排程任務到時間軸
- **智慧排程** - AI 自動安排任務最佳執行時間（Premium 功能）
- **拖曳排程** - 直覺式拖放任務到指定時段

### 4. 🍅 番茄鐘 (Pomodoro)

- **計時器** - 標準 25 分鐘工作 + 5 分鐘休息循環
- **自訂設定** - 調整工作時長、休息時長、長休息間隔
- **當前任務綁定** - 選擇正在執行的任務
- **專注統計** - 記錄每日番茄鐘完成數

### 5. 📊 統計分析 (Stats)

- **概覽面板** - 本週完成數、平均專注時間
- **完成率趨勢** - 視覺化完成率變化
- **分類分佈** - 圓餅圖顯示各類別任務佔比
- **壓力熱力圖** - 識別一週中任務密集時段
- **歷史紀錄** - 瀏覽已完成任務清單

### 6. ⚙️ 設定 (Settings)

- **主題切換** - 淺色/深色模式
- **帳戶管理** - 個人資料與偏好設定
- **預設交通方式** - 設定通勤方式以計算移動時間
- **常用地點管理** - 儲存家、公司等常用地點

---

## 頁面介紹

| 頁面 | 路徑 | 說明 |
|------|------|------|
| 首頁 | `/` | 儀表板總覽，顯示今日行程與快速操作 |
| 任務管理 | `/tasks` | 任務清單與艾森豪矩陣視圖 |
| 行程規劃 | `/planner` | 日曆式行程安排與拖曳排程 |
| 番茄鐘 | `/pomodoro` | 專注計時器與番茄鐘設定 |
| 統計分析 | `/stats` | 效率追蹤與資料視覺化 |
| 設定 | `/settings` | 應用程式偏好與帳戶管理 |

---

## 技術架構

### 前端技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| **React** | 18.3 | UI 框架 |
| **TypeScript** | 5.x | 型別安全的 JavaScript |
| **Vite** | 5.x | 建構工具與開發伺服器 |
| **Tailwind CSS** | 3.x | 原子化 CSS 框架 |
| **shadcn/ui** | - | 可重用 UI 元件庫 |
| **React Router** | 6.x | 客戶端路由 |
| **TanStack Query** | 5.x | 資料獲取與快取管理 |
| **Recharts** | 2.x | 資料視覺化圖表 |
| **Framer Motion** | - | 動畫效果（透過 react-beautiful-dnd） |

### 後端技術棧 (Firebase)

| 技術 | 用途 |
|------|------|
| **Firebase Authentication** | 使用者認證（Email、Google 登入） |
| **Cloud Firestore** | NoSQL 資料庫 |
| **Cloud Functions** | 無伺服器後端邏輯 |
| **Firebase Cloud Messaging** | 推播通知 |
| **Cloud Tasks** | 排程任務與提醒 |

### AI 整合

| 服務 | 用途 |
|------|------|
| **Gemini API** | 智慧排程、語音轉任務 |

---

## 資料模型

### Firestore 集合結構

```
/users/{userId}
  ├── email: string
  ├── displayName: string
  ├── plan: 'FREE' | 'PREMIUM'
  └── createdAt: timestamp

/user_preferences/{userId}
  ├── efficiencyPeak: string (e.g., 'morning')
  ├── defaultTransport: string
  ├── compactSchedule: boolean
  └── deviceToken: string (FCM)

/categories/{categoryId}
  ├── userId: string
  ├── name: string
  └── colorHex: string

/tasks/{taskId}
  ├── userId: string
  ├── categoryId: string
  ├── title: string
  ├── importance: number (1-5)
  ├── urgency: number (1-5)
  ├── estMinutes: number
  ├── done: boolean
  ├── dueDate: timestamp
  └── createdAt: timestamp

/schedule_blocks/{blockId}
  ├── userId: string
  ├── taskId: string
  ├── start: timestamp
  ├── end: timestamp
  └── auto: boolean

/pomodoro_logs/{logId}
  ├── userId: string
  ├── taskId: string
  ├── start: timestamp
  └── end: timestamp
```

---

## 安裝與執行

### 環境需求

- Node.js 18+ 
- npm 或 bun

### 本地開發

```bash
# 1. 複製專案
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev

# 4. 開啟瀏覽器
# 預設網址：http://localhost:5173
```

### Firebase 設定

```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入 Firebase
firebase login

# 初始化專案（已完成）
firebase init

# 啟動本地模擬器
firebase emulators:start

# 部署至雲端
firebase deploy
```

---

## 開發指南

### 專案結構

```
src/
├── components/           # 可重用元件
│   ├── home/            # 首頁相關元件
│   ├── tasks/           # 任務管理元件
│   ├── planner/         # 行程規劃元件
│   ├── pomodoro/        # 番茄鐘元件
│   ├── stats/           # 統計分析元件
│   ├── settings/        # 設定頁元件
│   ├── navigation/      # 導航元件
│   ├── ui/              # shadcn UI 基礎元件
│   └── theme/           # 主題相關元件
├── pages/               # 頁面元件
├── hooks/               # 自訂 React Hooks
├── lib/                 # 工具函式
└── main.tsx            # 應用程式入口

functions/               # Firebase Cloud Functions
├── src/
│   ├── services/       # 商業邏輯服務
│   ├── jobs/           # 排程任務
│   ├── types/          # TypeScript 型別定義
│   └── index.ts        # Functions 入口
```

### 設計系統

本專案採用語意化設計 Token，所有顏色定義於 `src/index.css`：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --destructive: 0 84.2% 60.2%;
}
```

### 元件開發規範

1. **使用 TypeScript** - 所有元件必須有完整型別定義
2. **語意化 Tailwind** - 使用 design token 而非硬編碼顏色
3. **響應式設計** - 支援桌面與行動裝置
4. **無障礙設計** - 使用適當的 ARIA 屬性
5. **元件拆分** - 保持單一職責，避免過大元件

---

## 未來規劃

### Phase 1 - 基礎功能完善
- [ ] Firebase 認證整合
- [ ] Firestore 資料同步
- [ ] 離線模式支援

### Phase 2 - 智慧功能
- [ ] AI 智慧排程 (Gemini API)
- [ ] 語音輸入轉任務
- [ ] 移動時間計算

### Phase 3 - 進階功能
- [ ] 推播通知提醒
- [ ] 團隊協作功能
- [ ] 第三方日曆整合 (Google Calendar)
- [ ] 週報告與分析

### Phase 4 - 跨平台
- [ ] Progressive Web App (PWA)
- [ ] React Native 行動應用

---

## 授權

本專案為私有專案，版權所有。

---

## 聯絡方式

如有任何問題或建議，歡迎透過以下方式聯繫：

- **Lovable 專案連結**: [Time Planner](https://lovable.dev/projects/4506e3e9-5203-4412-96cd-bc99990e19a1)

---

*最後更新：2026 年 2 月*
