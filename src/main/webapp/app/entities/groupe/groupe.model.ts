import { IEnseignant } from 'app/entities/enseignant/enseignant.model';
import { Filiere } from 'app/entities/enumerations/filiere.model';

export interface IGroupe {
  id: number;
  nomGroupe?: string | null;
  filiere?: keyof typeof Filiere | null;
  enseigants?: Pick<IEnseignant, 'id'>[] | null;
}

export type NewGroupe = Omit<IGroupe, 'id'> & { id: null };
