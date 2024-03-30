import dayjs from 'dayjs/esm';
import { IPartenaire } from 'app/entities/partenaire/partenaire.model';

export interface IEvenement {
  id: number;
  titre?: string | null;
  description?: string | null;
  dateDebut?: dayjs.Dayjs | null;
  dateFin?: dayjs.Dayjs | null;
  lieu?: string | null;
  organisateur?: string | null;
  partenaires?: Pick<IPartenaire, 'id'>[] | null;
}

export type NewEvenement = Omit<IEvenement, 'id'> & { id: null };
