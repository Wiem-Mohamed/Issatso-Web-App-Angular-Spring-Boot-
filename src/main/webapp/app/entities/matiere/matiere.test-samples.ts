import { IMatiere, NewMatiere } from './matiere.model';

export const sampleWithRequiredData: IMatiere = {
  id: 94805,
};

export const sampleWithPartialData: IMatiere = {
  id: 72793,
};

export const sampleWithFullData: IMatiere = {
  id: 52868,
  matiereName: 'intangible Métal global',
};

export const sampleWithNewData: NewMatiere = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
