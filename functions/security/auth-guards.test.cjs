const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const https = require('firebase-functions/v2/https');

function loadOffline() {
  let backendCalls = 0;
  const blocked = new Proxy({}, { get() { backendCalls++; throw new Error('Backend access forbidden in auth-guard tests'); } });
  const modules = {
    dotenv: { config() {} },
    'firebase-functions/v2/https': https,
    'firebase-functions/logger': { info() {}, error() {} },
    '@google/generative-ai': { GoogleGenerativeAI: class { getGenerativeModel() { return blocked; } } },
    'firebase-admin/app': { initializeApp() {} },
    'firebase-admin/firestore': { getFirestore: () => blocked },
    'firebase-admin/auth': { getAuth: () => blocked },
    'firebase-admin/messaging': { getMessaging: () => blocked },
    '@google-cloud/tasks': { CloudTasksClient: class { queuePath() { return 'fixture-queue'; } } },
  };
  const exports = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../lib/index.js'), 'utf8'), {
    exports, module: { exports }, process: { env: { GCP_PROJECT: 'demo-security-audit', GEMINI_KEY: 'fixture-only' } },
    require(name) { assert.ok(Object.hasOwn(modules, name), `Unexpected import ${name}`); return modules[name]; },
    console, Buffer,
  });
  return { exports, backendCalls: () => backendCalls };
}

for (const name of ['smartSchedule', 'getWeeklyAnalytics', 'sendTestNotification', 'parseVoiceText']) {
  test(`${name} rejects an unauthenticated caller before backend access`, async () => {
    const loaded = loadOffline();
    await assert.rejects(loaded.exports[name].run({ data: {}, auth: null }), error => error.code === 'unauthenticated');
    assert.equal(loaded.backendCalls(), 0);
  });
}
// The existing createPremiumUser HTTP helper is deliberately never invoked.