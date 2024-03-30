import { IPartenaire, NewPartenaire } from './partenaire.model';

export const sampleWithRequiredData: IPartenaire = {
  id: 34738,
};

export const sampleWithPartialData: IPartenaire = {
  id: 12193,
  nom: 'Recyclé',
  domaineActivite: 'users compressing Voiture',
  adresse: 'Incroyable',
  contact: 'Nissan',
};

export const sampleWithFullData: IPartenaire = {
  id: 19945,
  nom: 'Uranium Folk',
  description: '../fake-data/blob/hipster.txt',
  domaineActivite: 'Leu backing',
  adresse: 'bleuet b de',
  contact: 'compressing man',
};

export const sampleWithNewData: NewPartenaire = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
