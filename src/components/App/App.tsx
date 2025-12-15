import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
              
import VehiculeProvider from '../../contexts/VehiculeContext';
import LoginPage from '../LoginPage';
import ListeVehiculesPage from '../ListeVehiculesPage';
import CreateVehiculePage from '../CreateVehiculePage';
import EditVehiculePage from '../EditVehiculePage';

import Menu from '../Menu';

export default function App() {
  
  return (
    <VehiculeProvider>
      <BrowserRouter>
        <Routes>
          {/* Page de login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Layout principal avec le menu */}
          <Route path="/" element={<Menu />}>
            {/* Page principale des véhicules */}
            <Route index element={<ListeVehiculesPage />} />
            <Route path="vehicules" element={<ListeVehiculesPage />} />
            <Route path="create" element={<CreateVehiculePage />} />
            <Route path="edit/:id" element={<EditVehiculePage />} />
          </Route>

          {/* Toute autre URL  redirection vers /vehicules */}
          <Route path="*" element={<Navigate to="/vehicules" replace />} />
        </Routes>
      </BrowserRouter>
    </VehiculeProvider>
  );
}
