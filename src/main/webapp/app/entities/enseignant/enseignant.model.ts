import dayjs from 'dayjs/esm';
import { IGroupe } from 'app/entities/groupe/groupe.model';
import { Grade } from 'app/entities/enumerations/grade.model';

export interface IEnseignant {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  cin?: string | null;
  email?: string | null;
  numTel?: string | null;
  dateEmbauche?: dayjs.Dayjs | null;
  grade?: keyof typeof Grade | null;
  groupes?: Pick<IGroupe, 'id' | 'nomGroupe'>[] | null;
}

export type NewEnseignant = Omit<IEnseignant, 'id'> & { id: null };
