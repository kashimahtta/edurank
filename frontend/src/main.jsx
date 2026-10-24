import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LectureProvider } from './context/LectureContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LectureProvider>
        <App />
      </LectureProvider>
    </BrowserRouter>
  </StrictMode>
);
