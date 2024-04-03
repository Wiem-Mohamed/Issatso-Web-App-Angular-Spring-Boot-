import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDemandeEtudiant, NewDemandeEtudiant } from '../demande-etudiant.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDemandeEtudiant for edit and NewDemandeEtudiantFormGroupInput for create.
 */
type DemandeEtudiantFormGroupInput = IDemandeEtudiant | PartialWithRequiredKeyOf<NewDemandeEtudiant>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDemandeEtudiant | NewDemandeEtudiant> = Omit<T, 'dateCreation'> & {
  dateCreation?: string | null;
};

type DemandeEtudiantFormRawValue = FormValueOf<IDemandeEtudiant>;

type NewDemandeEtudiantFormRawValue = FormValueOf<NewDemandeEtudiant>;

type DemandeEtudiantFormDefaults = Pick<NewDemandeEtudiant, 'id' | 'dateCreation'>;

type DemandeEtudiantFormGroupContent = {
  id: FormControl<DemandeEtudiantFormRawValue['id'] | NewDemandeEtudiant['id']>;
  sujet: FormControl<DemandeEtudiantFormRawValue['sujet']>;
  description: FormControl<DemandeEtudiantFormRawValue['description']>;
  statut: FormControl<DemandeEtudiantFormRawValue['statut']>;
  dateCreation: FormControl<DemandeEtudiantFormRawValue['dateCreation']>;
  proprietaire: FormControl<DemandeEtudiantFormRawValue['proprietaire']>;
};

export type DemandeEtudiantFormGroup = FormGroup<DemandeEtudiantFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DemandeEtudiantFormService {
  createDemandeEtudiantFormGroup(demandeEtudiant: DemandeEtudiantFormGroupInput = { id: null }): DemandeEtudiantFormGroup {
    const demandeEtudiantRawValue = this.convertDemandeEtudiantToDemandeEtudiantRawValue({
      ...this.getFormDefaults(),
      ...demandeEtudiant,
    });
    return new FormGroup<DemandeEtudiantFormGroupContent>({
      id: new FormControl(
        { value: demandeEtudiantRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      sujet: new FormControl(demandeEtudiantRawValue.sujet),
      description: new FormControl(demandeEtudiantRawValue.description),
      statut: new FormControl(demandeEtudiantRawValue.statut),
      dateCreation: new FormControl(demandeEtudiantRawValue.dateCreation),
      proprietaire: new FormControl(demandeEtudiantRawValue.proprietaire),
    });
  }

  getDemandeEtudiant(form: DemandeEtudiantFormGroup): IDemandeEtudiant | NewDemandeEtudiant {
    return this.convertDemandeEtudiantRawValueToDemandeEtudiant(
      form.getRawValue() as DemandeEtudiantFormRawValue | NewDemandeEtudiantFormRawValue
    );
  }

  resetForm(form: DemandeEtudiantFormGroup, demandeEtudiant: DemandeEtudiantFormGroupInput): void {
    const demandeEtudiantRawValue = this.convertDemandeEtudiantToDemandeEtudiantRawValue({ ...this.getFormDefaults(), ...demandeEtudiant });
    form.reset(
      {
        ...demandeEtudiantRawValue,
        id: { value: demandeEtudiantRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DemandeEtudiantFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateCreation: currentTime,
    };
  }

  private convertDemandeEtudiantRawValueToDemandeEtudiant(
    rawDemandeEtudiant: DemandeEtudiantFormRawValue | NewDemandeEtudiantFormRawValue
  ): IDemandeEtudiant | NewDemandeEtudiant {
    return {
      ...rawDemandeEtudiant,
      dateCreation: dayjs(rawDemandeEtudiant.dateCreation, DATE_TIME_FORMAT),
    };
  }

  private convertDemandeEtudiantToDemandeEtudiantRawValue(
    demandeEtudiant: IDemandeEtudiant | (Partial<NewDemandeEtudiant> & DemandeEtudiantFormDefaults)
  ): DemandeEtudiantFormRawValue | PartialWithRequiredKeyOf<NewDemandeEtudiantFormRawValue> {
    return {
      ...demandeEtudiant,
      dateCreation: demandeEtudiant.dateCreation ? demandeEtudiant.dateCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
