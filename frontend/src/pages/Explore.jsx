import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLectures } from '../context/LectureContext';
import FilterBar, { applyFilters, defaultFilters } from '../components/FilterBar';
import LectureCard from '../components/LectureCard';

export default function Explore() {
  const { ranked } = useLectures();
  const [params] = useSearchParams();
  const [filters, setFilters] = useState({ ...defaultFilters, q: (params.get('q') || '').slice(0, 100) });
  const results = applyFilters(ranked, filters);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Explore lectures</h1>
      <FilterBar filters={filters} onChange={setFilters} />
      <p className="text-sm text-slate-500" aria-live="polite">{results.length} lecture(s) found</p>
      {results.length === 0 ? (
        <p className="rounded-lg bg-white p-8 text-center text-slate-500">No lectures match. Try clearing filters.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((l) => <LectureCard key={l.id} lecture={l} />)}
        </div>
      )}
    </section>
  );
}
