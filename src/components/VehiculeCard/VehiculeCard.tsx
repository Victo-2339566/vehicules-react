import { useContext } from 'react';
import { VehiculeContext } from '../../contexts/VehiculeContext';
import type { Vehicule } from '../../models/Vehicule';

interface VehiculeCardProps {
  vehicule: Vehicule;
  onEdit: () => void;
  onDelete: () => void;
}

export default function VehiculeCard(props: VehiculeCardProps) {
  const { vehicule, onEdit, onDelete } = props;
  const { isLoggedIn } = useContext(VehiculeContext);

  const categoryColors: Record<string, string> = {
    'Économique': 'bg-green-100 text-green-800',
    'Standard': 'bg-blue-100 text-blue-800',
    'SUV': 'bg-orange-100 text-orange-800',
    'Luxe': 'bg-purple-100 text-purple-800',
  };

  const categoryColor = categoryColors[vehicule.categorie] || 'bg-gray-100 text-gray-800';
  const availabilityColor = vehicule.disponible
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col h-full">
      {/* Header avec marque et catégorie */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{vehicule.marque}</h2>
            <p className="text-gray-600 text-sm">{vehicule.modele}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${categoryColor}`}>
            {vehicule.categorie}
          </span>
        </div>
      </div>

      {/* Détails du véhicule */}
      <div className="p-5 flex-grow">
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Immatriculation:</span>
            <span className="font-semibold text-gray-900">{vehicule.immatriculation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Année:</span>
            <span className="font-semibold text-gray-900">{vehicule.annee}</span>
          </div>
          
          {vehicule.options && vehicule.options.length > 0 && (
            <div className="pt-2">
              <p className="text-gray-600 text-xs mb-1.5">Options:</p>
              <div className="flex flex-wrap gap-1">
                {vehicule.options.map((option, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prix et disponibilité */}
      <div className="p-5 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-blue-600">${vehicule.prixJour}</p>
            <p className="text-xs text-gray-500">par jour</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${availabilityColor}`}>
            {vehicule.disponible ? '✓ Disponible' : '✗ Indisponible'}
          </span>
        </div>

        {/* Boutons d'action */}
        {isLoggedIn && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300 text-sm"
            >
              Modifier
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition duration-300 text-sm"
            >
               Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}