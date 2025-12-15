import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { VehiculeContext } from '../../contexts/VehiculeContext';
import { API_BASE_URL } from '../../constants';
import type { Vehicule } from '../../models/Vehicule';
import VehiculeCard from '../VehiculeCard/VehiculeCard';

export default function ListeVehiculesPage() {
  const [vehiculesList, setVehiculesList] = useState<Vehicule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDisponibilite, setFilterDisponibilite] = useState<'all' | 'disponible'>('all');

  const { token } = useContext(VehiculeContext);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    // Construction des params de filtre
    const params: Record<string, string> = {};
    if (filterDisponibilite === 'disponible') {
      params.disponible = 'true';
    }

    axios
      .get(`${API_BASE_URL}/api/vehicules`, { params })
      .then((response) => {
        let data = response.data;
        if (data && typeof data === 'object' && !Array.isArray(data) && 'data' in data) {
          data = data.data;
        }
        if (Array.isArray(data)) {
          setVehiculesList(data as Vehicule[]);
        } else {
          setVehiculesList([]);
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des véhicules:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filterDisponibilite]); // recharger quand le filtre change

  function handleDelete(vehiculeId: string) {
  const ok = window.confirm(
    'Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est définitive.'
  );
  if (!ok) return;

  axios
    .delete(`${API_BASE_URL}/api/vehicules/${vehiculeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      setVehiculesList((prev) => prev.filter((v) => v._id !== vehiculeId));
      alert('Véhicule supprimé avec succès.');
    })
    .catch((error) => {
      console.error('Erreur lors de la suppression du véhicule:', error);
      alert('Erreur lors de la suppression du véhicule.');
    });
}

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Chargement des véhicules...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header + filtre */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Véhicules disponibles
          </h1>
          <p className="text-gray-600">
            {vehiculesList.length} véhicule{vehiculesList.length > 1 ? 's' : ''} trouvé
          </p>
        </div>

        {/* Filtre disponible / tout */}
        <div className="inline-flex rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setFilterDisponibilite('all')}
            className={`px-4 py-2 text-sm font-medium ${
              filterDisponibilite === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Tous les véhicules
          </button>
          <button
            type="button"
            onClick={() => setFilterDisponibilite('disponible')}
            className={`px-4 py-2 text-sm font-medium border-l border-gray-200 ${
              filterDisponibilite === 'disponible'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Uniquement disponibles
          </button>
        </div>
      </div>

      {/* Grille */}
      <div className="max-w-7xl mx-auto">
        {vehiculesList && vehiculesList.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehiculesList.map((vehicule) =>
              vehicule._id ? (
                <VehiculeCard
                  key={vehicule._id}
                  vehicule={vehicule}
                  onEdit={() => navigate(`/edit/${vehicule._id}`)}
                  onDelete={() => handleDelete(vehicule._id!)}
                />
              ) : null
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-16">
            <p className="text-lg font-semibold">Aucun véhicule trouvé</p>
            <p className="text-sm">Revenez plus tard pour voir nos offres.</p>
          </div>
        )}
      </div>
    </div>
  );
}
