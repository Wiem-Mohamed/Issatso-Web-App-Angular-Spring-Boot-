import dayjs from 'dayjs/esm';

export interface IActualite {
  id: number;
  titre?: string | null;
  image?: string | null;
  imageContentType?: string | null;
  contenu?: string | null;
  datePublication?: dayjs.Dayjs | null;
}

export type NewActualite = Omit<IActualite, 'id'> & { id: null };
