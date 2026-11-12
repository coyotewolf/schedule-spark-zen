const test = require('node:test');
const assert = require('node:assert/strict');
const lock = require('../package-lock.json');

// These tests never contact Firebase, Cloud Tasks, FCM, or Gemini.
process.env.GCLOUD_PROJECT = 'dependency-smoke-test';
process.env.GEMINI_KEY = 'unused-local-test-key';
const functions = require('../lib/index.js');

for (const name of ['smartSchedule', 'getWeeklyAnalytics', 'sendTestNotification', 'parseVoiceText']) {
  test(`${name} rejects unauthenticated callers before accessing services`, async () => {
    await assert.rejects(functions[name].run({ data: {} }), { code: 'unauthenticated' });
  });
}
for (const [name, data] of [
  ['getWeeklyAnalytics', {}],
  ['getWeeklyAnalytics', { startDate: 'invalid', endDate: 'invalid' }],
  ['sendTestNotification', {}],
  ['parseVoiceText', { voiceText: ' ' }],
]) {
  test(`${name} rejects invalid input ${JSON.stringify(data)}`, async () => {
    await assert.rejects(functions[name].run({ auth: { uid: 'local-test' }, data }), { code: 'invalid-argument' });
  });
}

test('lockfile excludes the reported vulnerable parser/querystring versions', () => {
  let checked = 0;
  for (const [path, entry] of Object.entries(lock.packages)) {
    const version = entry.version?.split('.').map(Number);
    if (path.endsWith('node_modules/qs')) {
      assert.ok(version[0] === 6 && (version[1] > 16 || (version[1] === 16 && version[2] >= 1)), `${path}: ${entry.version}`);
      checked++;
    }
    if (path.endsWith('node_modules/fast-xml-parser')) {
      // The current storage SDK resolves the maintained 5.x line.
      assert.ok(version[0] === 5 && version[1] >= 12, `${path}: ${entry.version}`);
      checked++;
    }
  }
  assert.ok(checked >= 2, 'Both dependency families must be present and checked');
});

test('updated XML and querystring parsers retain basic parsing behavior', () => {
  const { XMLParser } = require('fast-xml-parser');
  const qs = require('qs');
  assert.deepEqual(new XMLParser().parse('<ListBucketResult><Name>example</Name></ListBucketResult>'), { ListBucketResult: { Name: 'example' } });
  assert.deepEqual(qs.parse('filter[name]=example&limit=2'), { filter: { name: 'example' }, limit: '2' });
});
