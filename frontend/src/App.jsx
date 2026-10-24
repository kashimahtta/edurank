import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Rankings from './pages/Rankings';
import Saved from './pages/Saved';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="*" element={<p>Page not found. <Link className="underline" to="/">Go home</Link></p>} />
        </Routes>
      </main>
      <footer className="py-6 text-center text-xs text-slate-400">
        EduRank · Phase 1 demo with mock data. Rankings are heuristic estimates.
      </footer>
    </>
  );
}
