import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { VehiculeContext } from '../../contexts/VehiculeContext';
import { API_BASE_URL } from '../../constants';
import VehiculeForm from '../VehiculeForm';
import type { Vehicule } from '../../models/Vehicule';

export default function CreateVehiculePage() {
  const { isLoggedIn, token } = useContext(VehiculeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn]);

  /**
 * Création véhicule
 * @param data - Données sans _id
 * 
 * `Omit<Vehicule, '_id'>` : Solution **proposée par IA**
 *  Pour ne pas repeter les attributs du modèle Vehicule (10 champs)
 */

  function handleCreate(data: Omit<Vehicule, '_id'>) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios
    .post(`${API_BASE_URL}/api/vehicules`, data, config)
    .then(() => {
      alert('Véhicule ajouté avec succès.');
      navigate('/vehicules');
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout du véhicule:", error);
      alert("Erreur lors de l'ajout du véhicule");
    });
}


  if (!isLoggedIn) {
    return <div className="flex items-center justify-center min-h-screen text-2xl">Chargement...</div>;
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900"> Créer un véhicule</h1>
          <p className="text-gray-600 mt-2">Ajoutez un nouveau véhicule à votre flotte</p>
        </div>
        <VehiculeForm onSubmit={handleCreate} />
      </div>
    </div>
  );
}