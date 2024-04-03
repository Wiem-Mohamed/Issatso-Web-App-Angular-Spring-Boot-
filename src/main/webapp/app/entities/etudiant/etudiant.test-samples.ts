import dayjs from 'dayjs/esm';

import { Filiere } from 'app/entities/enumerations/filiere.model';

import { IEtudiant, NewEtudiant } from './etudiant.model';

export const sampleWithRequiredData: IEtudiant = {
  id: 60691,
};

export const sampleWithPartialData: IEtudiant = {
  id: 30461,
  nom: 'que Berkshire',
  email: 'Anatolie_Bernard@yahoo.fr',
  dateAffectation: dayjs('2024-03-29T18:14'),
  niveau: 58891,
};

export const sampleWithFullData: IEtudiant = {
  id: 4684,
  nom: 'Kazakhstan',
  prenom: 'online backing',
  email: 'Edgard.Breton85@yahoo.fr',
  numInscription: 'auparavant',
  dateAffectation: dayjs('2024-03-30T13:20'),
  filiere: 'LGC',
  niveau: 44246,
};

export const sampleWithNewData: NewEtudiant = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
