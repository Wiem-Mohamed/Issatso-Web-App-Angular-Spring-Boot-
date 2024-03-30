import dayjs from 'dayjs/esm';
import { IMatiere } from 'app/entities/matiere/matiere.model';

export interface ISupportDeCours {
  id: number;
  titre?: string | null;
  description?: string | null;
  contenu?: string | null;
  dateDepot?: dayjs.Dayjs | null;
  nomMatiere?: Pick<IMatiere, 'id'> | null;
}

export type NewSupportDeCours = Omit<ISupportDeCours, 'id'> & { id: null };
