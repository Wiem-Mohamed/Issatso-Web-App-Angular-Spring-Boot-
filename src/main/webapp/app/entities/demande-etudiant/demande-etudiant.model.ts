import dayjs from 'dayjs/esm';
import { SujetEtud } from 'app/entities/enumerations/sujet-etud.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IDemandeEtudiant {
  id: number;
  sujet?: keyof typeof SujetEtud | null;
  description?: string | null;
  statut?: keyof typeof Status | null;
  dateCreation?: dayjs.Dayjs | null;
  proprietaire?: string | null;
}

export type NewDemandeEtudiant = Omit<IDemandeEtudiant, 'id'> & { id: null };
