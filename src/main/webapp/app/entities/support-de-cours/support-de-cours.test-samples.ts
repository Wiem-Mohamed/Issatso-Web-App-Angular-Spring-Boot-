import dayjs from 'dayjs/esm';

import { Filiere } from 'app/entities/enumerations/filiere.model';

import { ISupportDeCours, NewSupportDeCours } from './support-de-cours.model';

export const sampleWithRequiredData: ISupportDeCours = {
  id: 84336,
};

export const sampleWithPartialData: ISupportDeCours = {
  id: 86804,
  titre: 'retrait',
  description: 'Femme Folk',
  niveau: 34808,
};

export const sampleWithFullData: ISupportDeCours = {
  id: 80340,
  titre: 'protocol Chrysler ding',
  description: 'c Vélocar',
  contenu: 'aïe',
  dateDepot: dayjs('2024-03-30T03:57'),
  filiere: 'PREPA',
  niveau: 20963,
};

export const sampleWithNewData: NewSupportDeCours = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
