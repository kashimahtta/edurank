/** Simple content-based recommendations from saved lectures (Phase 1 placeholder for ML in Phase 9). */
export function recommend(ranked, savedIds, limit = 4) {
  const saved = ranked.filter((l) => savedIds.includes(l.id));
  const candidates = ranked.filter((l) => !savedIds.includes(l.id));

  if (saved.length === 0) {
    return candidates.slice(0, limit).map((l) => ({
      lecture: l,
      reason: 'Popular starting point: it has one of the highest overall LQS scores. Save lectures to personalize this list.',
    }));
  }

  const subjects = new Set(saved.map((l) => l.subject));
  const topics = new Set(saved.map((l) => l.topic));
  return candidates
    .map((l) => {
      const topicMatch = topics.has(l.topic);
      const subjectMatch = subjects.has(l.subject);
      const match = topicMatch ? 2 : subjectMatch ? 1 : 0;
      const ref = saved.find((s) => (topicMatch ? s.topic === l.topic : s.subject === l.subject));
      const reason = match
        ? `Because you saved “${ref.title}” (${topicMatch ? 'same topic' : 'same subject'}: ${topicMatch ? l.topic : l.subject}).`
        : 'Highly ranked overall, outside your saved subjects, to broaden your learning.';
      return { lecture: l, reason, match };
    })
    .sort((a, b) => b.match - a.match || b.lecture.lqs.score - a.lecture.lqs.score)
    .slice(0, limit);
}
