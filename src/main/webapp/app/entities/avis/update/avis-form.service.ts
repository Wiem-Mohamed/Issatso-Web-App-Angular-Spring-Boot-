import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAvis, NewAvis } from '../avis.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAvis for edit and NewAvisFormGroupInput for create.
 */
type AvisFormGroupInput = IAvis | PartialWithRequiredKeyOf<NewAvis>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAvis | NewAvis> = Omit<T, 'dateCreation'> & {
  dateCreation?: string | null;
};

type AvisFormRawValue = FormValueOf<IAvis>;

type NewAvisFormRawValue = FormValueOf<NewAvis>;

type AvisFormDefaults = Pick<NewAvis, 'id' | 'dateCreation'>;

type AvisFormGroupContent = {
  id: FormControl<AvisFormRawValue['id'] | NewAvis['id']>;
  sujet: FormControl<AvisFormRawValue['sujet']>;
  description: FormControl<AvisFormRawValue['description']>;
  dateCreation: FormControl<AvisFormRawValue['dateCreation']>;
};

export type AvisFormGroup = FormGroup<AvisFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AvisFormService {
  createAvisFormGroup(avis: AvisFormGroupInput = { id: null }): AvisFormGroup {
    const avisRawValue = this.convertAvisToAvisRawValue({
      ...this.getFormDefaults(),
      ...avis,
    });
    return new FormGroup<AvisFormGroupContent>({
      id: new FormControl(
        { value: avisRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      sujet: new FormControl(avisRawValue.sujet),
      description: new FormControl(avisRawValue.description),
      dateCreation: new FormControl(avisRawValue.dateCreation),
    });
  }

  getAvis(form: AvisFormGroup): IAvis | NewAvis {
    return this.convertAvisRawValueToAvis(form.getRawValue() as AvisFormRawValue | NewAvisFormRawValue);
  }

  resetForm(form: AvisFormGroup, avis: AvisFormGroupInput): void {
    const avisRawValue = this.convertAvisToAvisRawValue({ ...this.getFormDefaults(), ...avis });
    form.reset(
      {
        ...avisRawValue,
        id: { value: avisRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AvisFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateCreation: currentTime,
    };
  }

  private convertAvisRawValueToAvis(rawAvis: AvisFormRawValue | NewAvisFormRawValue): IAvis | NewAvis {
    return {
      ...rawAvis,
      dateCreation: dayjs(rawAvis.dateCreation, DATE_TIME_FORMAT),
    };
  }

  private convertAvisToAvisRawValue(
    avis: IAvis | (Partial<NewAvis> & AvisFormDefaults)
  ): AvisFormRawValue | PartialWithRequiredKeyOf<NewAvisFormRawValue> {
    return {
      ...avis,
      dateCreation: avis.dateCreation ? avis.dateCreation.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
