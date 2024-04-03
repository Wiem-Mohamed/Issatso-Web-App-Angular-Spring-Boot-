import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDemandeEnseignant, NewDemandeEnseignant } from '../demande-enseignant.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDemandeEnseignant for edit and NewDemandeEnseignantFormGroupInput for create.
 */
type DemandeEnseignantFormGroupInput = IDemandeEnseignant | PartialWithRequiredKeyOf<NewDemandeEnseignant>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDemandeEnseignant | NewDemandeEnseignant> = Omit<T, 'dateCreation'> & {
  dateCreation?: string | null;
};

type DemandeEnseignantFormRawValue = FormValueOf<IDemandeEnseignant>;

type NewDemandeEnseignantFormRawValue = FormValueOf<NewDemandeEnseignant>;

type DemandeEnseignantFormDefaults = Pick<NewDemandeEnseignant, 'id' | 'dateCreation'>;

type DemandeEnseignantFormGroupContent = {
  id: FormControl<DemandeEnseignantFormRawValue['id'] | NewDemandeEnseignant['id']>;
  sujet: FormControl<DemandeEnseignantFormRawValue['sujet']>;
  description: FormControl<DemandeEnseignantFormRawValue['description']>;
  statut: FormControl<DemandeEnseignantFormRawValue['statut']>;
  dateCreation: FormControl<DemandeEnseignantFormRawValue['dateCreation']>;
  proprietaire: FormControl<DemandeEnseignantFormRawValue['proprietaire']>;
};

export type DemandeEnseignantFormGroup = FormGroup<DemandeEnseignantFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DemandeEnseignantFormService {
  createDemandeEnseignantFormGroup(demandeEnseignant: DemandeEnseignantFormGroupInput = { id: null }): DemandeEnseignantFormGroup {
    const demandeEnseignantRawValue = this.convertDemandeEnseignantToDemandeEnseignantRawValue({
      ...this.getFormDefaults(),
      ...demandeEnseignant,
    });
    return new FormGroup<DemandeEnseignantFormGroupContent>({
      id: new FormControl(
        { value: demandeEnseignantRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      sujet: new FormControl(demandeEnseignantRawValue.sujet),
      description: new FormControl(demandeEnseignantRawValue.description),
      statut: new FormControl(demandeEnseignantRawValue.statut),
      dateCreation: new FormControl(demandeEnseignantRawValue.dateCreation),
      proprietaire: new FormControl(demandeEnseignantRawValue.proprietaire),
    });
  }

  getDemandeEnseignant(form: DemandeEnseignantFormGroup): IDemandeEnseignant | NewDemandeEnseignant {
    return this.convertDemandeEnseignantRawValueToDemandeEnseignant(
      form.getRawValue() as DemandeEnseignantFormRawValue | NewDemandeEnseignantFormRawValue
    );
  }

  resetForm(form: DemandeEnseignantFormGroup, demandeEnseignant: DemandeEnseignantFormGroupInput): void {
    const demandeEnseignantRawValue = this.convertDemandeEnseignantToDemandeEnseignantRawValue({
      ...this.getFormDefaults(),
      ...demandeEnseignant,
    });
    form.reset(
      {
        ...demandeEnseignantRawValue,
        id: { value: demandeEnseignantRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DemandeEnseignantFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateCreation: currentTime,
    };
  }

  private convertDemandeEnseignantRawValueToDemandeEnseignant(
    rawDemandeEnseignant: DemandeEnseignantFormRawValue | NewDemandeEnseignantFormRawValue
  ): IDemandeEnseignant | NewDemandeEnseignant {
    return {
      ...rawDemandeEnseignant,
      dateCreation: dayjs(rawDemandeEnseignant.dateCreation, DATE_TIME_FORMAT),
    };
  }

  private convertDemandeEnseignantToDemandeEnseignantRawValue(
    demandeEnseignant: IDemandeEnseignant | (Partial<NewDemandeEnseignant> & DemandeEnseignantFormDefaults)
  ): DemandeEnseignantFormRawValue | PartialWithRequiredKeyOf<NewDemandeEnseignantFormRawValue> {
    return {
      ...demandeEnseignant,
      dateCreation: demandeEnseignant.dateCreation ? demandeEnseignant.dateCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
