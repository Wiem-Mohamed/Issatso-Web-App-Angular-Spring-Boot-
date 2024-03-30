import dayjs from 'dayjs/esm';

import { IActualite, NewActualite } from './actualite.model';

export const sampleWithRequiredData: IActualite = {
  id: 98278,
};

export const sampleWithPartialData: IActualite = {
  id: 6620,
  titre: 'Electronique',
  datePublication: dayjs('2024-03-29T20:06'),
};

export const sampleWithFullData: IActualite = {
  id: 21133,
  titre: 'Ingenieur',
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  contenu: '../fake-data/blob/hipster.txt',
  datePublication: dayjs('2024-03-29T20:58'),
};

export const sampleWithNewData: NewActualite = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
