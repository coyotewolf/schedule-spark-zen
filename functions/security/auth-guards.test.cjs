const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const https = require('firebase-functions/v2/https');

function loadOffline(overrides = {}) {
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
  Object.assign(modules, overrides);
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
// All following calls use an isolated VM and fake Auth/Firestore; never live services.
function premiumFixture(options = {}) {
  const calls = [];
  const auth = {
    async verifyIdToken(token, checkRevoked) { calls.push(['verify', token, checkRevoked]); if(options.invalid) throw Error('invalid'); return options.claims || {admin:true}; },
    async getUserByEmail(email) { calls.push(['lookup',email]); if(options.lookupError) throw {code:'auth/internal-error'}; if(options.newUser) throw {code:'auth/user-not-found'}; return {uid:'fixture-user'}; },
    async createUser(data) { calls.push(['create',data.email]); return {uid:'fixture-user'}; }
  };
  const db = {collection(name) { assert.equal(name,'users'); return {doc(uid) { assert.equal(uid,'fixture-user'); return {async set(data,config) {calls.push(['set',data,config]);}};}};}};
  const loaded = loadOffline({'firebase-admin/auth':{getAuth:()=>auth},'firebase-admin/firestore':{getFirestore:()=>db}});
  const invoke = async (input = {}) => {
    const response = {code:0,body:null,status(code){this.code=code;return this;},set(){return this;},send(body){this.body=body;return this;},json(body){this.body=body;return this;}};
    await loaded.exports.createPremiumUser({method:input.method || 'POST',get:()=>input.authorization,body:input.body},response);
    return response;
  };
  return {calls,invoke};
}
for (const scenario of [
  {name:'missing token',input:{},code:401},
  {name:'invalid token',options:{invalid:true},input:{authorization:'Bearer fixture'},code:401},
  {name:'nonadministrator',options:{claims:{admin:false}},input:{authorization:'Bearer fixture'},code:403},
  {name:'string admin claim',options:{claims:{admin:'true'}},input:{authorization:'Bearer fixture'},code:403},
  {name:'GET request',input:{method:'GET',authorization:'Bearer fixture'},code:405},
  {name:'malformed request',input:{authorization:'Bearer fixture',body:{email:'bad'}},code:400},
]) {
  test('premium helper rejects '+scenario.name+' before account/database mutation',async()=>{
    const f=premiumFixture(scenario.options);assert.equal((await f.invoke(scenario.input)).code,scenario.code);
    assert.equal(f.calls.some(c=>['lookup','create','set'].includes(c[0])),false);
    for(const call of f.calls.filter(c=>c[0]==='verify')) assert.equal(call[2],true);
  });
}
test('verified administrator can upgrade existing user without replacing profile',async()=>{
  const f=premiumFixture();assert.equal((await f.invoke({authorization:'Bearer fixture',body:{email:'fixture@example.invalid'}})).code,200);
  const set=f.calls.find(c=>c[0]==='set');assert.equal(set[1].plan,'PREMIUM');assert.equal(set[2].merge,true);
  assert.equal(f.calls.some(c=>c[0]==='create'),false);
});
test('verified administrator can create requested account with supplied password',async()=>{
  const f=premiumFixture({newUser:true});assert.equal((await f.invoke({authorization:'Bearer fixture',body:{email:'fixture@example.invalid',password:'fixture-only-password'}})).code,200);
  assert.equal(f.calls.filter(c=>c[0]==='create').length,1);
});
test('missing new-user password and provider lookup failure never create accounts',async()=>{
  for(const options of [{newUser:true},{lookupError:true}]){
    const f=premiumFixture(options);const response=await f.invoke({authorization:'Bearer fixture',body:{email:'fixture@example.invalid'}});
    assert.equal(response.code,options.newUser?400:500);assert.equal(f.calls.some(c=>c[0]==='create'||c[0]==='set'),false);
  }
});
