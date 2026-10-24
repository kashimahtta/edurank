import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLectures } from '../context/LectureContext';
import { recommend } from '../lib/recommend';
import LectureCard from '../components/LectureCard';

export default function Home() {
  const { ranked, saved } = useLectures();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const recs = recommend(ranked, saved);

  const submit = (e) => {
    e.preventDefault();
    navigate(`/explore${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
  };

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-white sm:p-12">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Find lectures worth your time.</h1>
        <p className="mt-2 max-w-xl text-indigo-100">
          EduRank scores lectures with a transparent formula and shows exactly why each one ranks where it does.
        </p>
        <form onSubmit={submit} className="mt-6 flex max-w-lg gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            maxLength={100}
            aria-label="Search lectures"
            placeholder="Try “machine learning” or “calculus”"
            className="min-w-0 flex-1 rounded-md px-3 py-2 text-slate-900"
          />
          <button className="rounded-md bg-white px-4 py-2 font-semibold text-indigo-700">Search</button>
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold">Top ranked</h2>
          <Link to="/rankings" className="text-sm text-indigo-600 underline">See all rankings</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {ranked.slice(0, 3).map((l) => <LectureCard key={l.id} lecture={l} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Recommended for you</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {recs.map((r) => <LectureCard key={r.lecture.id} lecture={r.lecture} reason={r.reason} />)}
        </div>
      </section>
    </div>
  );
}
