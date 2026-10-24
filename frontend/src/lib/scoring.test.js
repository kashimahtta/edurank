import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rankLectures, normalizeWeights, DEFAULT_WEIGHTS } from './scoring.js';

const teacher = { credibility: 0.8 };
const base = {
  views: 1000, likes: 90, dislikes: 10, completionRate: 0.7, ratingAvg: 4.5, ratingCount: 100,
  comments: 20, saves: 30, publishedAt: new Date().toISOString(), hasMaterials: true, teacher,
};

test('default weights sum to 1', () => {
  const sum = Object.values(normalizeWeights(DEFAULT_WEIGHTS)).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9);
});

test('zero weights fall back to defaults', () => {
  assert.deepEqual(normalizeWeights({ V: 0 }), DEFAULT_WEIGHTS);
});

test('zero-view and zero-rating lectures do not produce NaN', () => {
  const zero = { ...base, views: 0, likes: 0, dislikes: 0, ratingCount: 0, ratingAvg: 0, comments: 0, saves: 0 };
  const ranked = rankLectures([zero, zero]);
  for (const l of ranked) {
    assert.ok(Number.isFinite(l.lqs.score));
    assert.ok(l.lqs.score >= 0 && l.lqs.score <= 100);
  }
});

test('single lecture list works and cold start is flagged', () => {
  const [l] = rankLectures([{ ...base, views: 10 }]);
  assert.equal(l.lqs.coldStart, true);
});

test('better metrics rank higher', () => {
  const weak = { ...base, id: 'weak', likes: 10, dislikes: 40, completionRate: 0.2, ratingAvg: 2.5 };
  const ranked = rankLectures([weak, { ...base, id: 'good' }]);
  assert.equal(ranked[0].id, 'good');
});
