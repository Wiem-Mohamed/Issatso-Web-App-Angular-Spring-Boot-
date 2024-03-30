import { IEnseignant } from 'app/entities/enseignant/enseignant.model';

export interface IDepartement {
  id: number;
  departmentName?: string | null;
  chefDepartement?: Pick<IEnseignant, 'id'> | null;
}

export type NewDepartement = Omit<IDepartement, 'id'> & { id: null };
