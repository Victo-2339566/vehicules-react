import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { VehiculeContext } from '../../contexts/VehiculeContext';
import { API_BASE_URL } from '../../constants';
import type { Vehicule } from '../../models/Vehicule';
import VehiculeForm from '../VehiculeForm';

export default function EditVehiculePage() {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, token } = useContext(VehiculeContext);
  const navigate = useNavigate();

  const [vehicule, setVehicule] = useState<Vehicule | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (id) {
      axios
        .get(`${API_BASE_URL}/api/vehicules/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setVehicule(response.data.data);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération du véhicule:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, isLoggedIn, token]);

 /**
 * Mise à jour véhicule
 * @param data - Données sans _id
 * 
 * `Omit<Vehicule, '_id'>` : Solution **proposée par IA**
 *  Pour ne pas repeter les attributs du modèle Vehicule (10 champs)
 */

  function handleUpdate(data: Omit<Vehicule, '_id'>) {
  if (!id) return;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios
    .put(`${API_BASE_URL}/api/vehicules/${id}`, data, config)
    .then(() => {
      alert('Véhicule mis à jour avec succès.');
      navigate('/vehicules');
    })
    .catch((error) => {
      console.error('Erreur lors de la mise à jour du véhicule:', error);
      alert('Erreur lors de la mise à jour du véhicule.');
    });
}

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600">Chargement du véhicule...</div>
      </div>
    );
  }

  if (!vehicule) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-red-600">Véhicule introuvable.</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Modifier le véhicule</h1>
          <p className="text-gray-600 mt-2">{vehicule.marque} {vehicule.modele}</p>
        </div>
        <VehiculeForm initialValue={vehicule} onSubmit={handleUpdate} />
      </div>
    </div>
  );
}