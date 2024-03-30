import dayjs from 'dayjs/esm';

import { SujetEns } from 'app/entities/enumerations/sujet-ens.model';
import { Status } from 'app/entities/enumerations/status.model';

import { IDemandeEnseignant, NewDemandeEnseignant } from './demande-enseignant.model';

export const sampleWithRequiredData: IDemandeEnseignant = {
  id: 22956,
};

export const sampleWithPartialData: IDemandeEnseignant = {
  id: 8444,
  sujet: 'Conge',
  statut: 'Refusee',
  dateCreation: dayjs('2024-03-29T22:15'),
};

export const sampleWithFullData: IDemandeEnseignant = {
  id: 3617,
  sujet: 'Conge',
  description: '../fake-data/blob/hipster.txt',
  statut: 'Terminee',
  dateCreation: dayjs('2024-03-29T21:18'),
};

export const sampleWithNewData: NewDemandeEnseignant = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
