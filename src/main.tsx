import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App';
import VehiculeProvider from './contexts/VehiculeContext';
import './index.css'
createRoot(document.getElementById('root')!).render(
 <StrictMode>
   <VehiculeProvider>
  <App />
</VehiculeProvider>
  </StrictMode>,
);