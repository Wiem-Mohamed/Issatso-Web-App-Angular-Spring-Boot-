import dayjs from 'dayjs/esm';
import { IMatiere } from 'app/entities/matiere/matiere.model';
import { Filiere } from 'app/entities/enumerations/filiere.model';

export interface ISupportDeCours {
  id: number;
  titre?: string | null;
  description?: string | null;
  contenu?: string | null;
  contenuContentType?: string | null;
  dateDepot?: dayjs.Dayjs | null;
  filiere?: keyof typeof Filiere | null;
  niveau?: number | null;
  matiere?: Pick<IMatiere, 'id' | 'matiereName'> | null;
}

export type NewSupportDeCours = Omit<ISupportDeCours, 'id'> & { id: null };
