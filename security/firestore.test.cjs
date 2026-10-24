const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');
const { doc, setDoc, getDoc, updateDoc, deleteDoc } = require('firebase/firestore');

test('Firestore ownership blocks theft, reassignment, and anonymous access', async () => {
  const env = await initializeTestEnvironment({ projectId: 'demo-security-audit', firestore: {
    host: '127.0.0.1', port: Number(process.env.SECURITY_FIRESTORE_PORT || 8787),
    rules: fs.readFileSync(path.join(__dirname, '../firestore.rules'), 'utf8') } });
  try {
    const owner = env.authenticatedContext('alice').firestore();
    const attacker = env.authenticatedContext('bob').firestore();
    const anon = env.unauthenticatedContext().firestore();
    await assertSucceeds(setDoc(doc(owner, 'users/alice'), { name: 'Alice' }));
    await assertFails(setDoc(doc(attacker, 'users/alice'), { name: 'Hijacked' }));
    for (const collection of ['tasks','categories','schedule_blocks','pomodoro_logs']) {
      const key = collection + '/owner-item';
      await assertSucceeds(setDoc(doc(owner, key), { userId: 'alice', title: 'private' }));
      await assertSucceeds(getDoc(doc(owner, key)));
      await assertFails(getDoc(doc(attacker, key)));
      await assertFails(getDoc(doc(anon, key)));
      await assertFails(setDoc(doc(attacker, key), { userId: 'bob', title: 'stolen' }));
      await assertFails(updateDoc(doc(owner, key), { userId: 'bob' }));
      await assertFails(deleteDoc(doc(attacker, key)));
      await assertSucceeds(updateDoc(doc(owner, key), { title: 'updated' }));
      await assertSucceeds(deleteDoc(doc(owner, key)));
    }
  } finally { await env.cleanup(); }
});

test('client cannot mint or modify premium entitlements', async () => {
  const env = await initializeTestEnvironment({ projectId: 'demo-security-audit', firestore: {
    host: '127.0.0.1', port: Number(process.env.SECURITY_FIRESTORE_PORT || 8787),
    rules: fs.readFileSync(path.join(__dirname, '../firestore.rules'), 'utf8') } });
  try {
    const owner = env.authenticatedContext('plan-owner').firestore();
    const ref = doc(owner, 'users/plan-owner');
    await assertFails(setDoc(ref, {plan:'PREMIUM'}));
    await assertFails(setDoc(ref, {plan:null}));
    await assertSucceeds(setDoc(ref, {plan:'FREE',displayName:'Owner'}));
    await assertFails(updateDoc(ref, {plan:'PREMIUM'}));
    await assertFails(setDoc(ref, {displayName:'Remove plan'}));
    await assertSucceeds(updateDoc(ref, {displayName:'Updated'}));
    await env.withSecurityRulesDisabled(async context => {
      await setDoc(doc(context.firestore(), 'users/plan-owner'), {plan:'PREMIUM',displayName:'Owner'});
    });
    await assertSucceeds(updateDoc(ref, {displayName:'Still premium'}));
    await assertFails(updateDoc(ref, {plan:'FREE'}));
    await assertSucceeds(deleteDoc(ref));
    await assertFails(setDoc(ref, {plan:'PREMIUM'}));
    await assertSucceeds(setDoc(ref, {displayName:'No client entitlement'}));
    await assertFails(updateDoc(ref, {plan:'PREMIUM'}));
    await assertSucceeds(updateDoc(ref, {displayName:'Legacy-compatible'}));
  } finally { await env.cleanup(); }
});
