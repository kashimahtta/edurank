/**
 * Ranking logic (Phase 1: runs in the browser on mock data).
 * In Phase 4 this moves to the backend ranking engine with the same formula.
 *
 * LQS = 0.25V + 0.20L + 0.15C + 0.15T + 0.10R + 0.10E + 0.05Q   (each term in 0..1, result 0..100)
 *   V  views (log-normalized)         L  like ratio (smoothed)
 *   C  completion rate                T  teacher credibility
 *   R  Bayesian-average rating        E  engagement per view (normalized)
 *   Q  content quality signal (freshness + materials)
 *
 * This is a heuristic estimate, not an objective measure of teaching quality.
 */

export const DEFAULT_WEIGHTS = { V: 0.25, L: 0.2, C: 0.15, T: 0.15, R: 0.1, E: 0.1, Q: 0.05 };

export const METRIC_LABELS = {
  V: 'Views',
  L: 'Likes',
  C: 'Completion',
  T: 'Teacher credibility',
  R: 'Rating (Bayesian)',
  E: 'Engagement',
  Q: 'Content quality',
};

const COLD_START_VIEWS = 500; // below this, scores are blended toward the platform average
const BAYES_PRIOR_COUNT = 20; // "virtual" ratings at the platform mean

const clamp01 = (x) => (Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : 0);
const safeDiv = (a, b) => (b > 0 ? a / b : 0);

export function normalizeWeights(weights = DEFAULT_WEIGHTS) {
  const keys = Object.keys(DEFAULT_WEIGHTS);
  const clean = Object.fromEntries(keys.map((k) => [k, Math.max(0, Number(weights[k]) || 0)]));
  const sum = keys.reduce((s, k) => s + clean[k], 0);
  if (sum === 0) return { ...DEFAULT_WEIGHTS };
  return Object.fromEntries(keys.map((k) => [k, clean[k] / sum]));
}

/** Platform-wide stats needed for normalization. */
export function computeContext(lectures) {
  const n = lectures.length;
  const maxViews = Math.max(0, ...lectures.map((l) => l.views));
  const maxEngagement = Math.max(
    0,
    ...lectures.map((l) => safeDiv(l.comments + l.saves, l.views))
  );
  const rated = lectures.filter((l) => l.ratingCount > 0);
  const meanRating = rated.length
    ? rated.reduce((s, l) => s + l.ratingAvg, 0) / rated.length
    : 3.5;
  return { n, maxViews, maxEngagement, meanRating };
}

export function scoreLecture(lecture, ctx, weights = DEFAULT_WEIGHTS) {
  const w = normalizeWeights(weights);

  const V = safeDiv(Math.log10(1 + lecture.views), Math.log10(1 + ctx.maxViews));
  const L = (lecture.likes + 1) / (lecture.likes + lecture.dislikes + 2); // Laplace smoothing
  const C = lecture.completionRate; // already 0..1 (avg watched fraction)
  const T = lecture.teacher.credibility;
  const R = safeDiv(
    (BAYES_PRIOR_COUNT * ctx.meanRating + lecture.ratingAvg * lecture.ratingCount),
    BAYES_PRIOR_COUNT + lecture.ratingCount
  ) / 5;
  const E = safeDiv(safeDiv(lecture.comments + lecture.saves, lecture.views), ctx.maxEngagement);
  const ageDays = Math.max(0, (Date.now() - new Date(lecture.publishedAt).getTime()) / 864e5);
  const freshness = Math.exp(-ageDays / 730);
  const Q = 0.6 * freshness + 0.4 * (lecture.hasMaterials ? 1 : 0.4);

  let raw = { V, L, C, T, R, E, Q };

  // Cold start: with few views, behavioural signals are unreliable -> shrink toward neutral 0.5.
  const confidence = clamp01(safeDiv(lecture.views, COLD_START_VIEWS));
  const coldStart = confidence < 1;
  if (coldStart) {
    for (const k of ['L', 'C', 'E']) raw[k] = confidence * raw[k] + (1 - confidence) * 0.5;
  }
  raw = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, clamp01(v)]));

  const breakdown = Object.keys(w).map((k) => ({
    key: k,
    label: METRIC_LABELS[k],
    value: raw[k],
    weight: w[k],
    contribution: raw[k] * w[k] * 100,
  }));
  const score = breakdown.reduce((s, b) => s + b.contribution, 0);

  return { score, breakdown, coldStart, confidence, explanation: explain(breakdown, coldStart) };
}

function explain(breakdown, coldStart) {
  const top = [...breakdown].sort((a, b) => b.contribution - a.contribution).slice(0, 2);
  const weak = [...breakdown].sort((a, b) => a.value - b.value)[0];
  let text = `Ranked highly mainly because of ${top
    .map((t) => t.label.toLowerCase())
    .join(' and ')}.`;
  if (weak.value < 0.5) text += ` Weakest signal: ${weak.label.toLowerCase()}.`;
  if (coldStart) text += ' Few views so far, so scores are cautiously blended toward average.';
  return text;
}

export function rankLectures(lectures, weights = DEFAULT_WEIGHTS) {
  const ctx = computeContext(lectures);
  return lectures
    .map((l) => ({ ...l, lqs: scoreLecture(l, ctx, weights) }))
    .sort((a, b) => b.lqs.score - a.lqs.score)
    .map((l, i) => ({ ...l, rank: i + 1 }));
}
