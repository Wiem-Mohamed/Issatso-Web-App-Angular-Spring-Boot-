import { IEnseignant } from 'app/entities/enseignant/enseignant.model';

export interface IMatiere {
  id: number;
  matiereName?: string | null;
  enseignant?: Pick<IEnseignant, 'id' | 'nom'> | null;
}

export type NewMatiere = Omit<IMatiere, 'id'> & { id: null };
