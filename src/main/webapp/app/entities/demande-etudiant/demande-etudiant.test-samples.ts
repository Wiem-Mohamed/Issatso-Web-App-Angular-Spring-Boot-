import dayjs from 'dayjs/esm';

import { SujetEtud } from 'app/entities/enumerations/sujet-etud.model';
import { Status } from 'app/entities/enumerations/status.model';

import { IDemandeEtudiant, NewDemandeEtudiant } from './demande-etudiant.model';

export const sampleWithRequiredData: IDemandeEtudiant = {
  id: 45155,
};

export const sampleWithPartialData: IDemandeEtudiant = {
  id: 71268,
  sujet: 'Bourse',
  statut: 'EnAttente',
};

export const sampleWithFullData: IDemandeEtudiant = {
  id: 71578,
  sujet: 'Stage',
  description: '../fake-data/blob/hipster.txt',
  statut: 'Terminee',
  dateCreation: dayjs('2024-03-30T05:23'),
};

export const sampleWithNewData: NewDemandeEtudiant = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
