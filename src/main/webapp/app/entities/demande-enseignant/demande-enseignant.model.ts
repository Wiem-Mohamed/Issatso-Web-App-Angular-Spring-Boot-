import dayjs from 'dayjs/esm';
import { SujetEns } from 'app/entities/enumerations/sujet-ens.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IDemandeEnseignant {
  id: number;
  sujet?: keyof typeof SujetEns | null;
  description?: string | null;
  statut?: keyof typeof Status | null;
  dateCreation?: dayjs.Dayjs | null;
}

export type NewDemandeEnseignant = Omit<IDemandeEnseignant, 'id'> & { id: null };
