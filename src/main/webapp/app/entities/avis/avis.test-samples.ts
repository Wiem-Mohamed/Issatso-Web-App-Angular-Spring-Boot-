import dayjs from 'dayjs/esm';

import { IAvis, NewAvis } from './avis.model';

export const sampleWithRequiredData: IAvis = {
  id: 6855,
};

export const sampleWithPartialData: IAvis = {
  id: 55566,
  sujet: 'facture Maison navigating',
};

export const sampleWithFullData: IAvis = {
  id: 57291,
  sujet: 'gai a',
  description: '../fake-data/blob/hipster.txt',
  dateCreation: dayjs('2024-03-30T07:33'),
};

export const sampleWithNewData: NewAvis = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
