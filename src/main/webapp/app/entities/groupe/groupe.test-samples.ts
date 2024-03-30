import { Filiere } from 'app/entities/enumerations/filiere.model';

import { IGroupe, NewGroupe } from './groupe.model';

export const sampleWithRequiredData: IGroupe = {
  id: 29288,
};

export const sampleWithPartialData: IGroupe = {
  id: 41754,
};

export const sampleWithFullData: IGroupe = {
  id: 35246,
  nomGroupe: 'b ocre generate',
  filiere: 'LEEA',
};

export const sampleWithNewData: NewGroupe = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
