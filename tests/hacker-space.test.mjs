import test from 'node:test';
import assert from 'node:assert/strict';
import { scenarios, scoreAttempt, PASS_SCORE } from '../src/lib/hacker-space/scenarios.ts';
import { parseProgress, recordResult, readSnapshot, saveResult, subscribeProgress, PROGRESS_KEY } from '../src/lib/hacker-space/progress.ts';

const correct = [[1, 0, 2], [0, 2, 1], [1, 2, 0], [1, 2, 0]];
test('each published case has a reachable 100-point path and a non-passing path', () => {
  assert.equal(scenarios.length, 4);
  assert.equal(new Set(scenarios.map(s => s.id)).size, 4);
  assert.equal(PASS_SCORE, 80);
  scenarios.forEach((s, i) => {
    assert.equal(scoreAttempt(s, correct[i]), 100);
    assert.equal(scoreAttempt(s, [0, 0, 0]) < PASS_SCORE, true);
    assert.deepEqual(s.stages.map(stage => Math.max(...stage.actions.map(a => a.points))), [30, 30, 40]);
    assert.ok(s.sources.every(source => new URL(source.url).protocol === 'https:'));
  });
});
test('incomplete, duplicated-length, fractional, negative and out-of-range answers cannot complete a case', () => {
  for (const answers of [[], [1, 0], [1, 0, 2, 2], [1, 0, -1], [1, 0, 3], [1, 0, 1.5], [1, 0, NaN]]) {
    assert.equal(scoreAttempt(scenarios[0], answers), null);
  }
  assert.equal(scoreAttempt(scenarios[0], [1, 0, 1]), 75);
});
test('replay preserves the best result but updates last score and attempts', () => {
  const first = recordResult({}, scenarios[0], 100);
  const second = recordResult(first, scenarios[0], 40);
  assert.deepEqual(second.parcel, { version: 1, best: 100, last: 40, attempts: 2 });
  assert.equal(first.parcel.last, 100);
  assert.throws(() => recordResult(first, scenarios[0], 101));
});
test('corrupt or incompatible browser records degrade safely and do not unlock cases', () => {
  for (const raw of ['', '{broken', 'null', '[]', '{"schema":2,"results":{}}']) assert.deepEqual(parseProgress(raw, scenarios), {});
  const results = {
    parcel: { version: 1, best: 90, last: 80, attempts: 2 },
    'urgent-boss': { version: 0, best: 100, last: 100, attempts: 1 },
    'cafe-wifi': { version: 1, best: 101, last: 100, attempts: 1 },
    'ai-assistant': { version: 1, best: 50, last: 90, attempts: 1 },
    unknown: { version: 1, best: 100, last: 100, attempts: 1 },
  };
  assert.deepEqual(parseProgress(JSON.stringify({schema: 1, results}), scenarios), { parcel: results.parcel });
  assert.deepEqual(parseProgress(JSON.stringify({schema: 1, results: { parcel: {...results.parcel, attempts: 0} }}), scenarios), {});
});
test('browser storage notification, cleanup and denial are handled without blocking play', () => {
  const target = new EventTarget();
  const memory = new Map();
  globalThis.window = Object.assign(target, { localStorage: { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) } });
  let notifications = 0;
  const cleanup = subscribeProgress(() => notifications++);
  assert.equal(saveResult(scenarios, scenarios[0], 80), true);
  assert.equal(notifications, 1);
  assert.equal(parseProgress(readSnapshot(), scenarios).parcel.best, 80);
  assert.ok(memory.has(PROGRESS_KEY));
  cleanup();
  assert.equal(saveResult(scenarios, scenarios[0], 90), true);
  assert.equal(notifications, 1);
  window.localStorage.setItem = () => { throw new Error('quota denied'); };
  assert.equal(saveResult(scenarios, scenarios[0], 100), false);
  window.localStorage.getItem = () => { throw new Error('storage denied'); };
  assert.equal(readSnapshot(), '');
  delete globalThis.window;
});
