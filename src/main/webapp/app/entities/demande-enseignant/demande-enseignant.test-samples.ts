import dayjs from 'dayjs/esm';

import { SujetEns } from 'app/entities/enumerations/sujet-ens.model';
import { Status } from 'app/entities/enumerations/status.model';

import { IDemandeEnseignant, NewDemandeEnseignant } from './demande-enseignant.model';

export const sampleWithRequiredData: IDemandeEnseignant = {
  id: 65039,
};

export const sampleWithPartialData: IDemandeEnseignant = {
  id: 84786,
  description: '../fake-data/blob/hipster.txt',
  statut: 'Refusee',
};

export const sampleWithFullData: IDemandeEnseignant = {
  id: 3617,
  sujet: 'Conge',
  description: '../fake-data/blob/hipster.txt',
  statut: 'Terminee',
  dateCreation: dayjs('2024-03-29T21:18'),
  proprietaire: 'Homme Béton safre',
};

export const sampleWithNewData: NewDemandeEnseignant = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
