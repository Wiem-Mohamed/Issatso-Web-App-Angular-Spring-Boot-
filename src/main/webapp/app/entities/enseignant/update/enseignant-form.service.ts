import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEnseignant, NewEnseignant } from '../enseignant.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEnseignant for edit and NewEnseignantFormGroupInput for create.
 */
type EnseignantFormGroupInput = IEnseignant | PartialWithRequiredKeyOf<NewEnseignant>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEnseignant | NewEnseignant> = Omit<T, 'dateEmbauche'> & {
  dateEmbauche?: string | null;
};

type EnseignantFormRawValue = FormValueOf<IEnseignant>;

type NewEnseignantFormRawValue = FormValueOf<NewEnseignant>;

type EnseignantFormDefaults = Pick<NewEnseignant, 'id' | 'dateEmbauche' | 'groupes'>;

type EnseignantFormGroupContent = {
  id: FormControl<EnseignantFormRawValue['id'] | NewEnseignant['id']>;
  nom: FormControl<EnseignantFormRawValue['nom']>;
  prenom: FormControl<EnseignantFormRawValue['prenom']>;
  cin: FormControl<EnseignantFormRawValue['cin']>;
  email: FormControl<EnseignantFormRawValue['email']>;
  numTel: FormControl<EnseignantFormRawValue['numTel']>;
  dateEmbauche: FormControl<EnseignantFormRawValue['dateEmbauche']>;
  grade: FormControl<EnseignantFormRawValue['grade']>;
  chefDepartement: FormControl<EnseignantFormRawValue['chefDepartement']>;
  groupes: FormControl<EnseignantFormRawValue['groupes']>;
};

export type EnseignantFormGroup = FormGroup<EnseignantFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EnseignantFormService {
  createEnseignantFormGroup(enseignant: EnseignantFormGroupInput = { id: null }): EnseignantFormGroup {
    const enseignantRawValue = this.convertEnseignantToEnseignantRawValue({
      ...this.getFormDefaults(),
      ...enseignant,
    });
    return new FormGroup<EnseignantFormGroupContent>({
      id: new FormControl(
        { value: enseignantRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(enseignantRawValue.nom),
      prenom: new FormControl(enseignantRawValue.prenom),
      cin: new FormControl(enseignantRawValue.cin),
      email: new FormControl(enseignantRawValue.email),
      numTel: new FormControl(enseignantRawValue.numTel),
      dateEmbauche: new FormControl(enseignantRawValue.dateEmbauche),
      grade: new FormControl(enseignantRawValue.grade),
      chefDepartement: new FormControl(enseignantRawValue.chefDepartement),
      groupes: new FormControl(enseignantRawValue.groupes ?? []),
    });
  }

  getEnseignant(form: EnseignantFormGroup): IEnseignant | NewEnseignant {
    return this.convertEnseignantRawValueToEnseignant(form.getRawValue() as EnseignantFormRawValue | NewEnseignantFormRawValue);
  }

  resetForm(form: EnseignantFormGroup, enseignant: EnseignantFormGroupInput): void {
    const enseignantRawValue = this.convertEnseignantToEnseignantRawValue({ ...this.getFormDefaults(), ...enseignant });
    form.reset(
      {
        ...enseignantRawValue,
        id: { value: enseignantRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EnseignantFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateEmbauche: currentTime,
      groupes: [],
    };
  }

  private convertEnseignantRawValueToEnseignant(
    rawEnseignant: EnseignantFormRawValue | NewEnseignantFormRawValue
  ): IEnseignant | NewEnseignant {
    return {
      ...rawEnseignant,
      dateEmbauche: dayjs(rawEnseignant.dateEmbauche, DATE_TIME_FORMAT),
    };
  }

  private convertEnseignantToEnseignantRawValue(
    enseignant: IEnseignant | (Partial<NewEnseignant> & EnseignantFormDefaults)
  ): EnseignantFormRawValue | PartialWithRequiredKeyOf<NewEnseignantFormRawValue> {
    return {
      ...enseignant,
      dateEmbauche: enseignant.dateEmbauche ? enseignant.dateEmbauche.format(DATE_TIME_FORMAT) : undefined,
      groupes: enseignant.groupes ?? [],
    };
  }
}
