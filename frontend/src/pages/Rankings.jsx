import { useState } from 'react';
import { useLectures } from '../context/LectureContext';
import { SUBJECTS } from '../data/mockLectures';
import LectureCard from '../components/LectureCard';

export default function Rankings() {
  const { ranked } = useLectures();
  const [subject, setSubject] = useState('');
  const list = ranked.filter((l) => !subject || l.subject === subject);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Lecture rankings</h1>
      <p className="text-sm text-slate-600">
        LQS = 0.25·Views + 0.20·Likes + 0.15·Completion + 0.15·Teacher credibility + 0.10·Rating + 0.10·Engagement + 0.05·Quality.
        Views are log-scaled, ratings are Bayesian-averaged, and new lectures are handled with cold-start smoothing.
        Rankings are estimates and can't capture every aspect of learning quality.
      </p>
      <select aria-label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
        <option value="">All subjects (overall rank)</option>
        {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
      </select>
      <div className="grid gap-4">
        {list.map((l) => <LectureCard key={l.id} lecture={l} />)}
      </div>
    </section>
  );
}
