import { SUBJECTS, LEVELS } from '../data/mockLectures';

const field = 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-indigo-500';

export default function FilterBar({ filters, onChange }) {
  const set = (k) => (e) => onChange({ ...filters, [k]: e.target.value });
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <input
        type="search"
        aria-label="Search lectures"
        placeholder="Search title, teacher, topic…"
        maxLength={100}
        value={filters.q}
        onChange={set('q')}
        className={`${field} lg:col-span-1`}
      />
      <select aria-label="Subject" value={filters.subject} onChange={set('subject')} className={field}>
        <option value="">All subjects</option>
        {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
      </select>
      <select aria-label="Level" value={filters.level} onChange={set('level')} className={field}>
        <option value="">All levels</option>
        {LEVELS.map((s) => <option key={s}>{s}</option>)}
      </select>
      <select aria-label="Sort" value={filters.sort} onChange={set('sort')} className={field}>
        <option value="rank">Sort: LQS rank</option>
        <option value="views">Sort: Most viewed</option>
        <option value="newest">Sort: Newest</option>
      </select>
    </div>
  );
}

export const defaultFilters = { q: '', subject: '', level: '', sort: 'rank' };

export function applyFilters(lectures, { q, subject, level, sort }) {
  const needle = q.trim().toLowerCase();
  const out = lectures.filter(
    (l) =>
      (!subject || l.subject === subject) &&
      (!level || l.level === level) &&
      (!needle || [l.title, l.teacher.name, l.topic, l.subject].some((t) => t.toLowerCase().includes(needle)))
  );
  const sorters = {
    rank: (a, b) => a.rank - b.rank,
    views: (a, b) => b.views - a.views,
    newest: (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
  };
  return out.sort(sorters[sort] || sorters.rank);
}
