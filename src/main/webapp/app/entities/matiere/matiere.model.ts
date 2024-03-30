import { IEnseignant } from 'app/entities/enseignant/enseignant.model';

export interface IMatiere {
  id: number;
  matiereName?: string | null;
  nomEnseigant?: Pick<IEnseignant, 'id'> | null;
}

export type NewMatiere = Omit<IMatiere, 'id'> & { id: null };
