import { Link } from 'react-router-dom';
import { useLectures } from '../context/LectureContext';
import LectureCard from '../components/LectureCard';

export default function Saved() {
  const { ranked, saved } = useLectures();
  const list = ranked.filter((l) => saved.includes(l.id));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Saved lectures</h1>
      {list.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-slate-500">
          Nothing saved yet. <Link className="text-indigo-600 underline" to="/explore">Explore lectures</Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((l) => <LectureCard key={l.id} lecture={l} />)}
        </div>
      )}
      <p className="text-xs text-slate-400">Saved items are stored in this browser for now; accounts arrive in a later phase.</p>
    </section>
  );
}
