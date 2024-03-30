import dayjs from 'dayjs/esm';

import { Grade } from 'app/entities/enumerations/grade.model';

import { IEnseignant, NewEnseignant } from './enseignant.model';

export const sampleWithRequiredData: IEnseignant = {
  id: 71531,
};

export const sampleWithPartialData: IEnseignant = {
  id: 66962,
  nom: 'Account suisse',
  cin: 'calculating sépia wireless',
  dateEmbauche: dayjs('2024-03-30T11:25'),
  grade: 'PROFESSEUR',
};

export const sampleWithFullData: IEnseignant = {
  id: 53589,
  nom: 'Homme',
  prenom: 'déjà quantifying bypassing',
  cin: 'Jardin extatique',
  email: 'Janine.Berger@hotmail.fr',
  numTel: 'Berlines de',
  dateEmbauche: dayjs('2024-03-30T11:59'),
  grade: 'PROFESSEUR',
};

export const sampleWithNewData: NewEnseignant = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
