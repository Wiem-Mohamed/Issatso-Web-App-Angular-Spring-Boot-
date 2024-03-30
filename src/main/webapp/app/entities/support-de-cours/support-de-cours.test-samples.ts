import dayjs from 'dayjs/esm';

import { ISupportDeCours, NewSupportDeCours } from './support-de-cours.model';

export const sampleWithRequiredData: ISupportDeCours = {
  id: 97087,
};

export const sampleWithPartialData: ISupportDeCours = {
  id: 7575,
  titre: 'bientôt',
  contenu: 'Einsteinium Poulet b',
  dateDepot: dayjs('2024-03-30T01:17'),
};

export const sampleWithFullData: ISupportDeCours = {
  id: 18316,
  titre: 'Dodge',
  description: 'Account bypass a',
  contenu: 'solitaire override',
  dateDepot: dayjs('2024-03-30T16:06'),
};

export const sampleWithNewData: NewSupportDeCours = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
