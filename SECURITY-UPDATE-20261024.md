# Security toolchain update — 2026-10-24

Base: bd61fab9a56fbce30c1ae8a650f75577b3675b51 on existing fix/security-audit-20261024 branch.

Vite 5.4.10 -> 6.4.5.
react-swc 3.7.1 -> 3.11.0.
lovable-tagger 1.1.7 -> 1.1.13.

Applied semver-compatible audit fixes with install scripts disabled. No audit --force or major transitive overrides.
Use npm ci; package-lock.json is the authoritative repaired dependency graph. Stale root Bun lockfiles are retired to prevent reinstalling vulnerable versions.

Windows Node 24.16.0: production build passed. Lint reports source errors; it does not pass. Authenticated browser/backend workflows are not verified.
Full audit: 1 high / 7 moderate / 0 low / 0 critical.
Production audit: 1 high / 5 moderate / 0 low / 0 critical.
Remaining findings require separately tested migrations. A version finding does not demonstrate compromise.

Existing loopback and security changes are preserved. No merge, production deployment, grants, secrets, or cross-account migration was performed.

Official Vite advisories: GHSA-rq7h-c2jc-7f22; GHSA-9jrq-w75r-8gcw; GHSA-8g5g-mxqh-grgj.

Functions: compatible lockfile fixes applied; removed unused request binding and unused category read/mapping/type that blocked TypeScript compilation. Build now passes. No functions were invoked or deployed.
Functions full audit: 2 high / 9 moderate / 0 critical; production: 2 high / 7 moderate / 0 critical.
Existing Firestore ownership emulator test: 1 test passed, 0 failed on demo-security-audit. Firebase CLI reported an unexpected error during shutdown and exited 2, so the complete emulator command is not marked successful. Rules were copied unchanged into an isolated local fixture.
Existing createPremiumUser HTTP test helper remains in Functions source and needs a separate security review before any deployment. Firebase-admin/node-forge and other remaining advisories also require further work. Live Firestore rules are not deployed or verified.
