import dayjs from 'dayjs/esm';
import { IGroupe } from 'app/entities/groupe/groupe.model';
import { Filiere } from 'app/entities/enumerations/filiere.model';

export interface IEtudiant {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  numInscription?: string | null;
  dateAffectation?: dayjs.Dayjs | null;
  filiere?: keyof typeof Filiere | null;
  niveau?: number | null;
  groupe?: Pick<IGroupe, 'id' | 'nomGroupe'> | null;
}

export type NewEtudiant = Omit<IEtudiant, 'id'> & { id: null };
