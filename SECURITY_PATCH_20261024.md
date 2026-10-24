# Security patch — 2026-10-24

This patch addresses authorization/exposure defects found during a source review. It is not evidence that an attack occurred.

- User documents can only be created at the caller's UID.
- Existing owner is checked for reads, deletes, and updates. Updates also preserve ownership; another user cannot overwrite a document by changing userId to their own UID.
- Vite binds to loopback by default.

The Firestore regression test uses a local emulator and public packages `@firebase/rules-unit-testing` and `firebase`, installed in a separate test-tools directory. Set NODE_PATH to that directory's node_modules and SECURITY_FIRESTORE_PORT if needed, then run `node --test security/firestore.test.cjs`. It checks each of tasks, categories, schedule_blocks, and pomodoro_logs for ownership, reassignment, read, and delete behavior.

Deploy `firestore.rules` through the Firebase project before considering production fixed. No Firebase production access is available in this audit.
