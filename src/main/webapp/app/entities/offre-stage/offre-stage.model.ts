import dayjs from 'dayjs/esm';
import { IDepartement } from 'app/entities/departement/departement.model';
import { Domaine } from 'app/entities/enumerations/domaine.model';

export interface IOffreStage {
  id: number;
  titre?: string | null;
  description?: string | null;
  domaine?: keyof typeof Domaine | null;
  dateDebut?: dayjs.Dayjs | null;
  dateFin?: dayjs.Dayjs | null;
  entreprise?: string | null;
  lieu?: string | null;
  departement?: Pick<IDepartement, 'id' | 'departmentName'> | null;
}

export type NewOffreStage = Omit<IOffreStage, 'id'> & { id: null };
