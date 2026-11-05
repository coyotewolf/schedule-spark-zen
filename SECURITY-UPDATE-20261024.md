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

Full npm audit: 0 critical / 0 high / 5 moderate / 0 low. Production npm audit: 0 critical / 0 high / 3 moderate / 0 low. The remaining npm audit records concern the PostCSS selector-parser/Tailwind 3 toolchain (GHSA-rj75-hqrm-r3gf); see the upstream backport assessment below. No major parser override, audit suppression, or audit --force was used. Production audit includes build tooling brought in by the current dependency classification; it is not proof of runtime exploitability.

Functions: firebase-admin 14.5.0 and firebase-functions 7.4.0 replace the old toolchain; the unused, incompatible firebase-functions-test package is removed. Full and production npm audit both report zero findings. TypeScript build and four offline unauthenticated-call rejection tests pass under independently SHA256-verified official Node 22.23.4. The mocked backend tests never call createPremiumUser and are not a Functions emulator integration test.

The unchanged Firestore ownership test passed on demo-security-audit. A second combined run also passed with the actual Phrase Firebase client (2 tests total), CLI exit 0. Windows CLI left its Java child running after shutdown; the validated local runner cleans only a new process whose command includes this exact demo project and fixture rules path. Global config permissions were not changed; isolated XDG_CONFIG_HOME and CI/NO_UPDATE_NOTIFIER were used.

DO NOT deploy Functions or rules without approval. The previously exposed helper and client-writable plan are now fixed in source as described below; live state is unchanged. Live project schedule-spark-zen rules remain unverified because Firebase CLI lacks authentication. Capture the deployed ruleset before approving any change.

No merge or production deployment was performed in either pass.

Repeatable Windows runner: security/run-firestore-tests.ps1 -ValidationToolsDirectory <isolated-tools-directory>. The committed runner passed the ownership test, CLI exit 0, and left port 8787 free. It preserves pre-existing processes and global environment settings.

## CSS advisory backport assessment

The upstream advisory now lists 6.1.5 as patched, alongside 7.1.6: https://github.com/postcss/postcss-selector-parser/security/advisories/GHSA-rj75-hqrm-r3gf . The npm audit data retrieved during this run still classifies all versions below 7.1.6 as affected. Preserve this raw discrepancy; do not suppress findings or claim the audit is zero.

The main parser was already 6.1.5. A scoped same-major override updates typography's exact 6.0.10 dependency to 6.1.5; every installed parser is now the upstream-patched backport. This avoids a Tailwind 4 migration. Tracked source imports only reference Tailwind from build configuration; no application request path importing the selector parser was found. Ordinary trusted-source build-time use is outside the exploit path described upstream. Untrusted source/build inputs still deserve review.

All seven production builds and Chromium navigation smoke tests were rerun. Math initially rejected an incorrectly formatted fixture key, then passed with the unchanged CI fixture configuration; deployment guards remained enabled.

## Source-only authorization repair

createPremiumUser retains its creation/upgrade function but requires POST, a verified non-revoked Firebase ID token, and boolean admin=true custom claim. No Firestore role field is trusted. Hardcoded fixture credentials are removed from current source; this is not credential rotation or erasure of Git history. Administrators supply an email and, for new accounts, a 12-128 character password. Existing accounts keep their password/profile; plan changes use merge. Provider lookup errors do not trigger account creation, and credentials are not logged. No admin claim has been assigned and no live helper called. Existing GET callers must switch to authenticated POST; if no trusted administrator has the claim, the endpoint denies everyone. Provisioning claims requires separate approval.

Rules allow owner profile creation with absent/FREE plan, but prohibit any client plan change/removal. Existing Premium users may still update other profile fields. Deletion remains owner-only; recreation cannot mint Premium. Trusted Admin SDK is the intended entitlement writer.

Validation: Node 22 compilation; 13 offline tests (including missing/invalid token, false/string admin claim, method/input rejection, admin-only fake create/upgrade and provider failure); 2 real Firestore emulator tests covering ownership and entitlement create/update/removal/delete-recreate/legacy-profile behavior, CLI exit 0. Auth provider and account creation are mocked; no real account is created.

Before release: read/export live rules source, get approval for this exact change, and keep the previous source for an explicit redeploy if rollback is approved. Firebase CLI does not provide an automatic security-rules rollback command. Functions and rules are separate deployment steps.
