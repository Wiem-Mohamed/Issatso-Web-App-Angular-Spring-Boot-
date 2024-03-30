import dayjs from 'dayjs/esm';
import { IGroupe } from 'app/entities/groupe/groupe.model';

export interface IEtudiant {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  numInscription?: string | null;
  dateAffectation?: dayjs.Dayjs | null;
  groupe?: Pick<IGroupe, 'id'> | null;
}

export type NewEtudiant = Omit<IEtudiant, 'id'> & { id: null };
