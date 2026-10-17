import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import SharedRackPage from './components/SharedRackPage.jsx';
import { shareIdFromPath } from './lib/shareApi.js';
import './index.css';

// A view link (/r/<id>) shows that shared rack on its own, apart from this browser's rack.
const shareId = shareIdFromPath(window.location.pathname);

createRoot(document.getElementById('root')).render(<StrictMode>{shareId ? <SharedRackPage shareId={shareId} /> : <App />}</StrictMode>);
