import { IEnseignant } from 'app/entities/enseignant/enseignant.model';

export interface IDepartement {
  id: number;
  departmentName?: string | null;
  enseignant?: Pick<IEnseignant, 'id' | 'cin'> | null;
}

export type NewDepartement = Omit<IDepartement, 'id'> & { id: null };
