# Functions test-endpoint removal

The production Functions module previously exported an unauthenticated HTTP test utility, `createPremiumUser`, which provisioned a fixed test account and granted it a premium plan. Its implementation described it as a test utility. A repository-wide tracked-file search found no callers or deployment configuration requiring that export.

The existing `public/test.html` page connects explicitly to local Auth and Functions emulators and calls only `smartSchedule`; it does not invoke this provisioning handler. Its sign-in flow still requires a locally seeded test account. No accounts or emulator data are created or changed by this patch.

The handler and its now-unused Firebase Auth / HTTP-handler imports were removed. The four existing callable functions remain exported. A regression test verifies this export surface without invoking the removed handler or contacting external services.

## Deployment boundary

This change fixes the repository source only. It does not deploy Functions, inspect production access, delete a deployed function, or remove accounts/data created by an earlier deployment. If the old endpoint is already deployed, it may remain reachable until an authorized deployment/removal is completed. Confirm the deployed function inventory and handle that separately before treating production exposure as resolved.

The existing Functions lint configuration issue and other backend behavior are outside this targeted change. No production credentials, account operations, or external API calls are used by the regression test.
