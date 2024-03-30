import dayjs from 'dayjs/esm';

import { Domaine } from 'app/entities/enumerations/domaine.model';

import { IOffreStage, NewOffreStage } from './offre-stage.model';

export const sampleWithRequiredData: IOffreStage = {
  id: 74694,
};

export const sampleWithPartialData: IOffreStage = {
  id: 3646,
  titre: 'Investissement Vélo innovate',
  description: '../fake-data/blob/hipster.txt',
  domaine: 'INFORMATIQUE',
  dateDebut: dayjs('2024-03-29T21:26'),
  lieu: 'Litecoin',
};

export const sampleWithFullData: IOffreStage = {
  id: 60438,
  titre: 'glouglou nam sensor',
  description: '../fake-data/blob/hipster.txt',
  domaine: 'ENERGITIQUE',
  dateDebut: dayjs('2024-03-30T06:06'),
  dateFin: dayjs('2024-03-29T22:57'),
  entreprise: 'Mini c',
  lieu: 'Russie Saucisses',
};

export const sampleWithNewData: NewOffreStage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
