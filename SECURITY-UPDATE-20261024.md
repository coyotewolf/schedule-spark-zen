# Security toolchain update — 2026-10-24

Base: bd61fab9a56fbce30c1ae8a650f75577b3675b51 on existing fix/security-audit-20261024 branch.

Vite 5.4.10 -> 6.4.5.
react-swc 3.7.1 -> 3.11.0.
lovable-tagger 1.1.7 -> 1.1.13.

Applied semver-compatible audit fixes with install scripts disabled. No audit --force or major transitive overrides.
Use npm ci; package-lock.json is the authoritative repaired dependency graph. Stale root Bun lockfiles are retired to prevent reinstalling vulnerable versions.

Windows Node 24.16.0: production build passed. Lint reports source errors; it does not pass. Authenticated browser/backend workflows are not verified.

Existing loopback and security changes are preserved. No merge, production deployment, grants, secrets, or cross-account migration was performed.

Official Vite advisories: GHSA-rq7h-c2jc-7f22; GHSA-9jrq-w75r-8gcw; GHSA-8g5g-mxqh-grgj.


## Completed second pass

Removed unused Zod and @hookform/resolvers after checking tracked source imports. Migrated React Router DOM 6.x to 7.18.4; React 18 is retained. The applications use simple wildcard fallback routes and do not use the affected multi-segment relative splat patterns.

All production builds and real Chromium 404-to-home navigation smoke checks passed with external requests blocked. This does not verify authenticated backend workflows. Existing source lint failures remain outside this dependency update.

Full npm audit: 0 critical / 0 high / 5 moderate / 0 low. Production npm audit: 0 critical / 0 high / 3 moderate / 0 low. The remaining findings are the PostCSS selector-parser/Tailwind 3 toolchain (GHSA-rj75-hqrm-r3gf). Resolving them requires a separately validated CSS-toolchain migration; no major parser override, audit suppression, or audit --force was used. Production audit includes build tooling brought in by the current dependency classification; it is not proof of runtime exploitability.

Functions: firebase-admin 14.5.0 and firebase-functions 7.4.0 replace the old toolchain; the unused, incompatible firebase-functions-test package is removed. Full and production npm audit both report zero findings. TypeScript build and four offline unauthenticated-call rejection tests pass under independently SHA256-verified official Node 22.23.4. The mocked backend tests never call createPremiumUser and are not a Functions emulator integration test.

The unchanged Firestore ownership test passed on demo-security-audit. A second combined run also passed with the actual Phrase Firebase client (2 tests total), CLI exit 0. Windows CLI left its Java child running after shutdown; the validated local runner cleans only a new process whose command includes this exact demo project and fixture rules path. Global config permissions were not changed; isolated XDG_CONFIG_HOME and CI/NO_UPDATE_NOTIFIER were used.

DO NOT deploy Functions or rules without review: createPremiumUser is an unauthenticated account/premium creation helper; owner-writable users documents also permit plan changes. This task only reviewed that helper statically, never invoked it. Live project schedule-spark-zen rules remain unverified because Firebase CLI lacks authentication. Capture the deployed ruleset before approving any change.

No merge or production deployment was performed in either pass.

Repeatable Windows runner: security/run-firestore-tests.ps1 -ValidationToolsDirectory <isolated-tools-directory>. The committed runner passed the ownership test, CLI exit 0, and left port 8787 free. It preserves pre-existing processes and global environment settings.
