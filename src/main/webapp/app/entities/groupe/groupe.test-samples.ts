import { Filiere } from 'app/entities/enumerations/filiere.model';

import { IGroupe, NewGroupe } from './groupe.model';

export const sampleWithRequiredData: IGroupe = {
  id: 11961,
};

export const sampleWithPartialData: IGroupe = {
  id: 67220,
};

export const sampleWithFullData: IGroupe = {
  id: 66252,
  nomGroupe: 'a a',
  filiere: 'MPGM',
  niveau: 17328,
};

export const sampleWithNewData: NewGroupe = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
