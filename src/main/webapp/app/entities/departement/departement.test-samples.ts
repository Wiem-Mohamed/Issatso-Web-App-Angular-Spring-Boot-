import { IDepartement, NewDepartement } from './departement.model';

export const sampleWithRequiredData: IDepartement = {
  id: 38762,
  departmentName: 'ha abandonner',
};

export const sampleWithPartialData: IDepartement = {
  id: 7420,
  departmentName: 'Dysprosium',
};

export const sampleWithFullData: IDepartement = {
  id: 83046,
  departmentName: 'Homme paiement',
};

export const sampleWithNewData: NewDepartement = {
  departmentName: 'Chevrolet Epargne syndicate',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
