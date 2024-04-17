import dayjs from 'dayjs/esm';

import { Filiere } from 'app/entities/enumerations/filiere.model';

import { ISupportDeCours, NewSupportDeCours } from './support-de-cours.model';

export const sampleWithRequiredData: ISupportDeCours = {
  id: 21394,
};

export const sampleWithPartialData: ISupportDeCours = {
  id: 9915,
  titre: 'au',
  description: 'Cis bientôt sievert',
};

export const sampleWithFullData: ISupportDeCours = {
  id: 83082,
  titre: 'b',
  description: 'Dodge',
  contenu: '../fake-data/blob/hipster.png',
  contenuContentType: 'unknown',
  dateDepot: dayjs('2024-03-29T22:21'),
  filiere: 'LGEnerg',
  niveau: 56146,
};

export const sampleWithNewData: NewSupportDeCours = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
