import { NavLink, Link } from 'react-router-dom';
import { useLectures } from '../context/LectureContext';

const links = [
  ['/', 'Home'],
  ['/explore', 'Explore'],
  ['/rankings', 'Rankings'],
  ['/saved', 'Saved'],
];

export default function Navbar() {
  const { saved } = useLectures();
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link to="/" className="text-xl font-extrabold text-indigo-600">
          Edu<span className="text-slate-900">Rank</span>
        </Link>
        <nav className="flex gap-1 text-sm font-medium">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`
              }
            >
              {label}
              {label === 'Saved' && saved.length > 0 && (
                <span className="ml-1 rounded-full bg-indigo-600 px-1.5 text-xs text-white">{saved.length}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
