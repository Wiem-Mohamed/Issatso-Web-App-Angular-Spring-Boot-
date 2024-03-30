import dayjs from 'dayjs/esm';

import { IEvenement, NewEvenement } from './evenement.model';

export const sampleWithRequiredData: IEvenement = {
  id: 30342,
};

export const sampleWithPartialData: IEvenement = {
  id: 27524,
  titre: 'hub à',
};

export const sampleWithFullData: IEvenement = {
  id: 84891,
  titre: 'Frites insulter Country',
  description: '../fake-data/blob/hipster.txt',
  dateDebut: dayjs('2024-03-29T19:27'),
  dateFin: dayjs('2024-03-30T13:08'),
  lieu: 'a',
  organisateur: 'alias Buckinghamshire Maserati',
};

export const sampleWithNewData: NewEvenement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
