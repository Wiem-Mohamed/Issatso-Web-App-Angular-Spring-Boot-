import dayjs from 'dayjs/esm';

import { IEvenement, NewEvenement } from './evenement.model';

export const sampleWithRequiredData: IEvenement = {
  id: 82459,
};

export const sampleWithPartialData: IEvenement = {
  id: 27176,
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IEvenement = {
  id: 20338,
  titre: 'b',
  description: '../fake-data/blob/hipster.txt',
  dateDebut: dayjs('2024-03-30T05:28'),
  dateFin: dayjs('2024-03-29T17:06'),
  lieu: 'Luxueux entre',
};

export const sampleWithNewData: NewEvenement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
