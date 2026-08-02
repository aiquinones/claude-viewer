import { createRoot } from 'react-dom/client';
import { App } from './App';

const root: HTMLElement | null = document.getElementById('root');
if (root) createRoot(root).render(<App />);
