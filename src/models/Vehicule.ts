export interface Vehicule {
  _id?: string;

  marque: string;
  modele: string;
  immatriculation: string;
  categorie: 'Économique' | 'Standard' | 'SUV' | 'Luxe';
  prixJour: number;
  annee: number;
  disponible: boolean;
  dateMiseEnService?: Date;
  options: string[];
  dateCreation?: Date;
}
