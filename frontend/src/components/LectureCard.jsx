import { useState } from 'react';
import { useLectures } from '../context/LectureContext';

const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : String(n));

export default function LectureCard({ lecture, reason, showRank = true }) {
  const { saved, toggleSave } = useLectures();
  const [open, setOpen] = useState(false);
  const isSaved = saved.includes(lecture.id);
  const { score, breakdown, coldStart, explanation } = lecture.lqs;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        {showRank && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
            #{lecture.rank}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-snug">{lecture.title}</h3>
          <p className="text-sm text-slate-500">
            {lecture.teacher.name} · {lecture.durationMin} min · {fmt(lecture.views)} views
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">{score.toFixed(1)}</div>
          <div className="text-xs text-slate-400">LQS</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-slate-100 px-2 py-0.5">{lecture.subject}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5">{lecture.topic}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5">{lecture.level}</span>
        {coldStart && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">New · limited data</span>}
      </div>

      {reason && (
        <p className="mt-3 rounded-md bg-emerald-50 p-2 text-sm text-emerald-800">
          <strong>Why recommended:</strong> {reason}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
        >
          {open ? 'Hide' : 'Show'} score breakdown
        </button>
        <button
          onClick={() => toggleSave(lecture.id)}
          className={`rounded-md px-3 py-1 text-sm ${isSaved ? 'bg-indigo-600 text-white' : 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'}`}
        >
          {isSaved ? '★ Saved' : '☆ Save'}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-2">
          {breakdown.map((b) => (
            <div key={b.key} className="text-xs">
              <div className="flex justify-between">
                <span>
                  {b.label} <span className="text-slate-400">(weight {(b.weight * 100).toFixed(0)}%)</span>
                </span>
                <span className="font-medium">
                  {(b.value * 100).toFixed(0)}% → +{b.contribution.toFixed(1)}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded bg-slate-100">
                <div className="h-full bg-indigo-500" style={{ width: `${b.value * 100}%` }} />
              </div>
            </div>
          ))}
          <p className="text-sm text-slate-600">{explanation}</p>
          <p className="text-xs italic text-slate-400">
            LQS is a transparent heuristic estimate, not an objective verdict on lecture quality.
          </p>
        </div>
      )}
    </article>
  );
}
