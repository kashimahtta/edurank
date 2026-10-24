import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LECTURES } from '../data/mockLectures';
import { rankLectures } from '../lib/scoring';

const Ctx = createContext(null);
const KEY = 'edurank.saved';

function loadSaved() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function LectureProvider({ children }) {
  const [saved, setSaved] = useState(loadSaved);
  const ranked = useMemo(() => rankLectures(LECTURES), []);

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(saved)), [saved]);

  const toggleSave = (id) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return <Ctx.Provider value={{ ranked, saved, toggleSave }}>{children}</Ctx.Provider>;
}

export const useLectures = () => useContext(Ctx);
