// Realistic mock data for Phase 1. Replaced by API data in Phase 3. (Full 50+ seed arrives in Phase 2.)
export const SUBJECTS = ['Computer Science', 'Mathematics', 'Physics', 'Data Science', 'Economics'];
export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const T = {
  chen: { name: 'Dr. Lina Chen', credibility: 0.93 },
  okafor: { name: 'Prof. Emeka Okafor', credibility: 0.88 },
  rao: { name: 'Dr. Priya Rao', credibility: 0.9 },
  weber: { name: 'Prof. Jonas Weber', credibility: 0.82 },
  silva: { name: 'Marta Silva', credibility: 0.7 },
  tanaka: { name: 'Dr. Ken Tanaka', credibility: 0.85 },
  novice: { name: 'Sam Patel', credibility: 0.45 },
};

const d = (months) => new Date(Date.now() - months * 30 * 864e5).toISOString();

const L = (id, title, subject, topic, level, teacher, mins, views, likes, dislikes, completionRate, ratingAvg, ratingCount, comments, saves, ageMonths, hasMaterials = true) => ({
  id, title, subject, topic, level, teacher: T[teacher], durationMin: mins, views, likes, dislikes,
  completionRate, ratingAvg, ratingCount, comments, saves, publishedAt: d(ageMonths), hasMaterials,
  description: `${topic} explained clearly for ${level.toLowerCase()} learners.`,
});

export const LECTURES = [
  L('l1', 'Big-O Notation Demystified', 'Computer Science', 'Algorithms', 'Beginner', 'chen', 42, 182000, 15400, 600, 0.78, 4.8, 3100, 1200, 6400, 10),
  L('l2', 'Dynamic Programming Patterns', 'Computer Science', 'Algorithms', 'Advanced', 'chen', 68, 94000, 8100, 400, 0.64, 4.7, 1500, 900, 5200, 6),
  L('l3', 'Linked Lists from Scratch', 'Computer Science', 'Data Structures', 'Beginner', 'weber', 35, 240000, 14000, 2500, 0.69, 4.3, 4200, 800, 3900, 30),
  L('l4', 'Linear Algebra: Eigenvectors Visually', 'Mathematics', 'Linear Algebra', 'Intermediate', 'okafor', 55, 310000, 29000, 700, 0.74, 4.9, 6100, 2100, 11200, 24),
  L('l5', 'Calculus Limits in 30 Minutes', 'Mathematics', 'Calculus', 'Beginner', 'silva', 30, 51000, 3600, 500, 0.81, 4.4, 900, 210, 980, 8),
  L('l6', 'Probability: Bayes Theorem Intuition', 'Mathematics', 'Probability', 'Intermediate', 'okafor', 47, 128000, 11000, 300, 0.72, 4.8, 2300, 760, 4100, 14),
  L('l7', 'Quantum Mechanics: The Wavefunction', 'Physics', 'Quantum Mechanics', 'Advanced', 'tanaka', 75, 66000, 5200, 350, 0.55, 4.6, 1100, 540, 2300, 18),
  L('l8', 'Classical Mechanics: Newton to Lagrange', 'Physics', 'Mechanics', 'Intermediate', 'tanaka', 62, 87000, 6300, 900, 0.6, 4.2, 1400, 330, 1700, 40, false),
  L('l9', 'Intro to Machine Learning', 'Data Science', 'Machine Learning', 'Beginner', 'rao', 58, 420000, 36000, 1800, 0.66, 4.7, 8800, 3300, 15900, 20),
  L('l10', 'Pandas for Data Cleaning', 'Data Science', 'Data Wrangling', 'Beginner', 'rao', 40, 156000, 12000, 700, 0.8, 4.6, 2700, 640, 5100, 5),
  L('l11', 'Neural Networks Backprop Step by Step', 'Data Science', 'Deep Learning', 'Advanced', 'rao', 72, 98000, 9100, 250, 0.7, 4.9, 1900, 1000, 6200, 3),
  L('l12', 'Supply and Demand Basics', 'Economics', 'Microeconomics', 'Beginner', 'weber', 33, 205000, 9800, 3300, 0.62, 3.9, 3900, 520, 1600, 48, false),
  L('l13', 'Game Theory and Nash Equilibrium', 'Economics', 'Game Theory', 'Intermediate', 'silva', 50, 23000, 2100, 90, 0.77, 4.7, 410, 190, 760, 4),
  L('l14', 'Fresh Take: Transformers Explained', 'Data Science', 'Deep Learning', 'Intermediate', 'novice', 38, 140, 20, 1, 0.9, 5, 4, 3, 6, 0.3),
];
