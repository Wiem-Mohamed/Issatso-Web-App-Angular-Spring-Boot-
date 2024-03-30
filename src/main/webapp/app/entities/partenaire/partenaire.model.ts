import { IEvenement } from 'app/entities/evenement/evenement.model';

export interface IPartenaire {
  id: number;
  nom?: string | null;
  description?: string | null;
  domaineActivite?: string | null;
  adresse?: string | null;
  contact?: string | null;
  evenements?: Pick<IEvenement, 'id'>[] | null;
}

export type NewPartenaire = Omit<IPartenaire, 'id'> & { id: null };
