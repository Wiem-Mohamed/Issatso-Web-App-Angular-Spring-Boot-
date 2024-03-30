import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IActualite, NewActualite } from '../actualite.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActualite for edit and NewActualiteFormGroupInput for create.
 */
type ActualiteFormGroupInput = IActualite | PartialWithRequiredKeyOf<NewActualite>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IActualite | NewActualite> = Omit<T, 'datePublication'> & {
  datePublication?: string | null;
};

type ActualiteFormRawValue = FormValueOf<IActualite>;

type NewActualiteFormRawValue = FormValueOf<NewActualite>;

type ActualiteFormDefaults = Pick<NewActualite, 'id' | 'datePublication'>;

type ActualiteFormGroupContent = {
  id: FormControl<ActualiteFormRawValue['id'] | NewActualite['id']>;
  titre: FormControl<ActualiteFormRawValue['titre']>;
  image: FormControl<ActualiteFormRawValue['image']>;
  imageContentType: FormControl<ActualiteFormRawValue['imageContentType']>;
  contenu: FormControl<ActualiteFormRawValue['contenu']>;
  datePublication: FormControl<ActualiteFormRawValue['datePublication']>;
};

export type ActualiteFormGroup = FormGroup<ActualiteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActualiteFormService {
  createActualiteFormGroup(actualite: ActualiteFormGroupInput = { id: null }): ActualiteFormGroup {
    const actualiteRawValue = this.convertActualiteToActualiteRawValue({
      ...this.getFormDefaults(),
      ...actualite,
    });
    return new FormGroup<ActualiteFormGroupContent>({
      id: new FormControl(
        { value: actualiteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      titre: new FormControl(actualiteRawValue.titre),
      image: new FormControl(actualiteRawValue.image),
      imageContentType: new FormControl(actualiteRawValue.imageContentType),
      contenu: new FormControl(actualiteRawValue.contenu),
      datePublication: new FormControl(actualiteRawValue.datePublication),
    });
  }

  getActualite(form: ActualiteFormGroup): IActualite | NewActualite {
    return this.convertActualiteRawValueToActualite(form.getRawValue() as ActualiteFormRawValue | NewActualiteFormRawValue);
  }

  resetForm(form: ActualiteFormGroup, actualite: ActualiteFormGroupInput): void {
    const actualiteRawValue = this.convertActualiteToActualiteRawValue({ ...this.getFormDefaults(), ...actualite });
    form.reset(
      {
        ...actualiteRawValue,
        id: { value: actualiteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActualiteFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      datePublication: currentTime,
    };
  }

  private convertActualiteRawValueToActualite(rawActualite: ActualiteFormRawValue | NewActualiteFormRawValue): IActualite | NewActualite {
    return {
      ...rawActualite,
      datePublication: dayjs(rawActualite.datePublication, DATE_TIME_FORMAT),
    };
  }

  private convertActualiteToActualiteRawValue(
    actualite: IActualite | (Partial<NewActualite> & ActualiteFormDefaults)
  ): ActualiteFormRawValue | PartialWithRequiredKeyOf<NewActualiteFormRawValue> {
    return {
      ...actualite,
      datePublication: actualite.datePublication ? actualite.datePublication.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
