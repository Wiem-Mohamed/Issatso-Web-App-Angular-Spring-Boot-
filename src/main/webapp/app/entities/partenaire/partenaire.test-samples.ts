import { IPartenaire, NewPartenaire } from './partenaire.model';

export const sampleWithRequiredData: IPartenaire = {
  id: 72688,
};

export const sampleWithPartialData: IPartenaire = {
  id: 49851,
  nom: 'users compressing Voiture',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IPartenaire = {
  id: 31843,
  nom: 'Incroyable',
  description: '../fake-data/blob/hipster.txt',
  domaineActivite: 'Uranium Folk',
  adresse: 'Leu backing',
  contact: 'bleuet b de',
};

export const sampleWithNewData: NewPartenaire = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
