import dayjs from 'dayjs/esm';

import { SujetEtud } from 'app/entities/enumerations/sujet-etud.model';
import { Status } from 'app/entities/enumerations/status.model';

import { IDemandeEtudiant, NewDemandeEtudiant } from './demande-etudiant.model';

export const sampleWithRequiredData: IDemandeEtudiant = {
  id: 56775,
};

export const sampleWithPartialData: IDemandeEtudiant = {
  id: 1487,
  description: '../fake-data/blob/hipster.txt',
  dateCreation: dayjs('2024-03-29T23:16'),
};

export const sampleWithFullData: IDemandeEtudiant = {
  id: 23693,
  sujet: 'Bourse',
  description: '../fake-data/blob/hipster.txt',
  statut: 'Terminee',
  dateCreation: dayjs('2024-03-30T00:39'),
  proprietaire: 'Sur',
};

export const sampleWithNewData: NewDemandeEtudiant = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
