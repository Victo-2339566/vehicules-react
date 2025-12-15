import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Vehicule } from '../../models/Vehicule';

/**
 * Composant VehiculeForm : Centralise la gestion de tous les formulaires véhicules
 * 
 * Délocalise la logique de formulaire (inputs, validation, React.FormEvent)
 * Réutilisable : CreateVehiculePage + EditVehiculePage
 */

interface VehiculeFormProps {
  initialValue?: Partial<Vehicule>;
  onSubmit: (data: Omit<Vehicule, '_id'>) => Promise<void> | void;
  isSubmitting?: boolean;
}

export default function VehiculeForm(props: VehiculeFormProps) {
  const { initialValue, onSubmit, isSubmitting = false } = props;

  // États formulaires
  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
  const [immatriculation, setImmatriculation] = useState('');
  const [categorie, setCategorie] = useState<'Économique' | 'Standard' | 'SUV' | 'Luxe'>('Économique');
  const [prixJour, setPrixJour] = useState(0);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [disponible, setDisponible] = useState(true);
  const [optionsText, setOptionsText] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialisation
  useEffect(() => {
    if (initialValue) {
      setMarque(initialValue.marque ?? '');
      setModele(initialValue.modele ?? '');
      setImmatriculation(initialValue.immatriculation ?? '');
      setCategorie(initialValue.categorie ?? 'Économique');
      setPrixJour(initialValue.prixJour ?? 0);
      setAnnee(initialValue.annee ?? new Date().getFullYear());
      setDisponible(initialValue.disponible ?? true);
      setOptionsText(initialValue.options?.join(', ') ?? '');
      setErrors({}); 
    }
  }, [initialValue]);


  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Champs obligatoires
    if (!marque.trim()) newErrors.marque = 'Marque obligatoire';
    if (!modele.trim()) newErrors.modele = 'Modèle obligatoire';
    if (!immatriculation.trim()) newErrors.immatriculation = 'Immatriculation obligatoire';

    // Prix
    if (prixJour < 20) newErrors.prixJour = 'Prix minimum: 20$';
    if (prixJour > 500) newErrors.prixJour = 'Prix maximum: 500$';

    // Année
    if (annee < 2005) newErrors.annee = 'Année minimum: 2005';
    if (annee > new Date().getFullYear()) newErrors.annee = `Année maximum: ${new Date().getFullYear()}`;

    // Options (max 10)
    const options = optionsText.split(',').map(opt => opt.trim()).filter(opt => opt);
    if (options.length > 10) newErrors.optionsText = 'Maximum 10 options';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  
    if (!validate()) return;

    const options = optionsText
      .split(',')
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);

    await onSubmit({
      marque,
      modele,
      immatriculation,
      categorie,
      prixJour,
      annee,
      disponible,
      options,
    });
  };

  const inputClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Marque et Modèle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marque *</label>
          <input
            type="text"
            value={marque}
            onChange={(e) => setMarque(e.target.value)}
            className={`${inputClass} ${errors.marque ? 'border-red-500' : ''}`}
            placeholder="Ex: Toyota"
            required
          />
          {errors.marque && <span className="text-red-500 text-sm mt-1 block">{errors.marque}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Modèle *</label>
          <input
            type="text"
            value={modele}
            onChange={(e) => setModele(e.target.value)}
            className={`${inputClass} ${errors.modele ? 'border-red-500' : ''}`}
            placeholder="Ex: Corolla"
            required
          />
          {errors.modele && <span className="text-red-500 text-sm mt-1 block">{errors.modele}</span>}
        </div>
      </div>

      {/* Immatriculation et Catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Immatriculation *</label>
          <input
            type="text"
            value={immatriculation}
            onChange={(e) => setImmatriculation(e.target.value.toUpperCase())}
            className={`${inputClass} ${errors.immatriculation ? 'border-red-500' : ''}`}
            placeholder="Ex: ABC-1234"
            required
          />
          {errors.immatriculation && <span className="text-red-500 text-sm mt-1 block">{errors.immatriculation}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value as any)}
            className={`${inputClass} ${errors.categorie ? 'border-red-500' : ''}`}
            required
          >
            <option value="Économique">Économique</option>
            <option value="Standard">Standard</option>
            <option value="SUV">SUV</option>
            <option value="Luxe">Luxe</option>
          </select>
          {errors.categorie && <span className="text-red-500 text-sm mt-1 block">{errors.categorie}</span>}
        </div>
      </div>

      {/* Prix et Année */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prix par jour (€) *</label>
          <input
            type="number"
            value={prixJour}
            onChange={(e) => setPrixJour(Number(e.target.value))}
            className={`${inputClass} ${errors.prixJour ? 'border-red-500' : ''}`}
            min={20}
            max={500}
            placeholder="Ex: 50"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Min: 20€, Max: 500€</p>
          {errors.prixJour && <span className="text-red-500 text-sm mt-1 block">{errors.prixJour}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Année *</label>
          <input
            type="number"
            value={annee}
            onChange={(e) => setAnnee(Number(e.target.value))}
            className={`${inputClass} ${errors.annee ? 'border-red-500' : ''}`}
            min={2005}
            max={new Date().getFullYear()}
            placeholder={new Date().getFullYear().toString()}
            required
          />
          <p className="text-xs text-gray-500 mt-1">Entre 2005 et {new Date().getFullYear()}</p>
          {errors.annee && <span className="text-red-500 text-sm mt-1 block">{errors.annee}</span>}
        </div>
      </div>

      {/* Disponibilité */}
      <div className="flex items-center">
        <input
          id="disponible"
          type="checkbox"
          checked={disponible}
          onChange={(e) => setDisponible(e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="disponible" className="ml-2 block text-sm text-gray-900">
          ✓ Disponible à la location
        </label>
      </div>

      {/* Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Options (séparées par des virgules)
        </label>
        <input
          type="text"
          value={optionsText}
          onChange={(e) => setOptionsText(e.target.value)}
          className={`${inputClass} ${errors.optionsText ? 'border-red-500' : ''}`}
          placeholder="Ex: GPS, Climatisation, Toit panoramique"
        />
        <p className="text-xs text-gray-500 mt-1">Max 10 options</p>
        {errors.optionsText && <span className="text-red-500 text-sm mt-1 block">{errors.optionsText}</span>}
      </div>

      {/* Bouton submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
      >
        {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  );
}
