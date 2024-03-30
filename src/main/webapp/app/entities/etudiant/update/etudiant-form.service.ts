import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEtudiant, NewEtudiant } from '../etudiant.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEtudiant for edit and NewEtudiantFormGroupInput for create.
 */
type EtudiantFormGroupInput = IEtudiant | PartialWithRequiredKeyOf<NewEtudiant>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEtudiant | NewEtudiant> = Omit<T, 'dateAffectation'> & {
  dateAffectation?: string | null;
};

type EtudiantFormRawValue = FormValueOf<IEtudiant>;

type NewEtudiantFormRawValue = FormValueOf<NewEtudiant>;

type EtudiantFormDefaults = Pick<NewEtudiant, 'id' | 'dateAffectation'>;

type EtudiantFormGroupContent = {
  id: FormControl<EtudiantFormRawValue['id'] | NewEtudiant['id']>;
  nom: FormControl<EtudiantFormRawValue['nom']>;
  prenom: FormControl<EtudiantFormRawValue['prenom']>;
  email: FormControl<EtudiantFormRawValue['email']>;
  numInscription: FormControl<EtudiantFormRawValue['numInscription']>;
  dateAffectation: FormControl<EtudiantFormRawValue['dateAffectation']>;
  groupe: FormControl<EtudiantFormRawValue['groupe']>;
};

export type EtudiantFormGroup = FormGroup<EtudiantFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EtudiantFormService {
  createEtudiantFormGroup(etudiant: EtudiantFormGroupInput = { id: null }): EtudiantFormGroup {
    const etudiantRawValue = this.convertEtudiantToEtudiantRawValue({
      ...this.getFormDefaults(),
      ...etudiant,
    });
    return new FormGroup<EtudiantFormGroupContent>({
      id: new FormControl(
        { value: etudiantRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(etudiantRawValue.nom),
      prenom: new FormControl(etudiantRawValue.prenom),
      email: new FormControl(etudiantRawValue.email),
      numInscription: new FormControl(etudiantRawValue.numInscription),
      dateAffectation: new FormControl(etudiantRawValue.dateAffectation),
      groupe: new FormControl(etudiantRawValue.groupe),
    });
  }

  getEtudiant(form: EtudiantFormGroup): IEtudiant | NewEtudiant {
    return this.convertEtudiantRawValueToEtudiant(form.getRawValue() as EtudiantFormRawValue | NewEtudiantFormRawValue);
  }

  resetForm(form: EtudiantFormGroup, etudiant: EtudiantFormGroupInput): void {
    const etudiantRawValue = this.convertEtudiantToEtudiantRawValue({ ...this.getFormDefaults(), ...etudiant });
    form.reset(
      {
        ...etudiantRawValue,
        id: { value: etudiantRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EtudiantFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateAffectation: currentTime,
    };
  }

  private convertEtudiantRawValueToEtudiant(rawEtudiant: EtudiantFormRawValue | NewEtudiantFormRawValue): IEtudiant | NewEtudiant {
    return {
      ...rawEtudiant,
      dateAffectation: dayjs(rawEtudiant.dateAffectation, DATE_TIME_FORMAT),
    };
  }

  private convertEtudiantToEtudiantRawValue(
    etudiant: IEtudiant | (Partial<NewEtudiant> & EtudiantFormDefaults)
  ): EtudiantFormRawValue | PartialWithRequiredKeyOf<NewEtudiantFormRawValue> {
    return {
      ...etudiant,
      dateAffectation: etudiant.dateAffectation ? etudiant.dateAffectation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
