import dayjs from 'dayjs/esm';

import { IEtudiant, NewEtudiant } from './etudiant.model';

export const sampleWithRequiredData: IEtudiant = {
  id: 99768,
};

export const sampleWithPartialData: IEtudiant = {
  id: 46121,
  nom: 'repurpose syndicate que',
  prenom: 'Avon',
  email: 'tienne.Pons@yahoo.fr',
  dateAffectation: dayjs('2024-03-30T11:54'),
};

export const sampleWithFullData: IEtudiant = {
  id: 4536,
  nom: 'online haptic',
  prenom: 'Stagiaire',
  email: 'Alberte88@hotmail.fr',
  numInscription: 'Corse dépôt',
  dateAffectation: dayjs('2024-03-29T17:18'),
};

export const sampleWithNewData: NewEtudiant = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
