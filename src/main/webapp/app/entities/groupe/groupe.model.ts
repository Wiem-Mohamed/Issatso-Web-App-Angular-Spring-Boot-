import { IEnseignant } from 'app/entities/enseignant/enseignant.model';
import { Filiere } from 'app/entities/enumerations/filiere.model';
import { IEtudiant } from 'app/entities/etudiant/etudiant.model'; // Ajout de cette importation

export interface IGroupe {
  id: number;
  nomGroupe?: string | null;
  filiere?: keyof typeof Filiere | null;
  niveau?: number | null;
  enseigants?: Pick<IEnseignant, 'id'>[] | null;
  etudiants?: Pick<IEtudiant, 'id' | 'nom' | 'prenom' | 'numInscription' | 'filiere' | 'niveau'>[] | null; // Ajout de la propriété etudiants
}

export type NewGroupe = Omit<IGroupe, 'id'> & { id: null };
