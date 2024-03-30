import dayjs from 'dayjs/esm';

export interface IAvis {
  id: number;
  sujet?: string | null;
  description?: string | null;
  dateCreation?: dayjs.Dayjs | null;
}

export type NewAvis = Omit<IAvis, 'id'> & { id: null };
