import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISupportDeCours, NewSupportDeCours } from '../support-de-cours.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISupportDeCours for edit and NewSupportDeCoursFormGroupInput for create.
 */
type SupportDeCoursFormGroupInput = ISupportDeCours | PartialWithRequiredKeyOf<NewSupportDeCours>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISupportDeCours | NewSupportDeCours> = Omit<T, 'dateDepot'> & {
  dateDepot?: string | null;
};

type SupportDeCoursFormRawValue = FormValueOf<ISupportDeCours>;

type NewSupportDeCoursFormRawValue = FormValueOf<NewSupportDeCours>;

type SupportDeCoursFormDefaults = Pick<NewSupportDeCours, 'id' | 'dateDepot'>;

type SupportDeCoursFormGroupContent = {
  id: FormControl<SupportDeCoursFormRawValue['id'] | NewSupportDeCours['id']>;
  titre: FormControl<SupportDeCoursFormRawValue['titre']>;
  description: FormControl<SupportDeCoursFormRawValue['description']>;
  contenu: FormControl<SupportDeCoursFormRawValue['contenu']>;
  contenuContentType: FormControl<SupportDeCoursFormRawValue['contenuContentType']>;
  dateDepot: FormControl<SupportDeCoursFormRawValue['dateDepot']>;
  filiere: FormControl<SupportDeCoursFormRawValue['filiere']>;
  niveau: FormControl<SupportDeCoursFormRawValue['niveau']>;
  matiere: FormControl<SupportDeCoursFormRawValue['matiere']>;
};

export type SupportDeCoursFormGroup = FormGroup<SupportDeCoursFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SupportDeCoursFormService {
  createSupportDeCoursFormGroup(supportDeCours: SupportDeCoursFormGroupInput = { id: null }): SupportDeCoursFormGroup {
    const supportDeCoursRawValue = this.convertSupportDeCoursToSupportDeCoursRawValue({
      ...this.getFormDefaults(),
      ...supportDeCours,
    });
    return new FormGroup<SupportDeCoursFormGroupContent>({
      id: new FormControl(
        { value: supportDeCoursRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      titre: new FormControl(supportDeCoursRawValue.titre),
      description: new FormControl(supportDeCoursRawValue.description),
      contenu: new FormControl(supportDeCoursRawValue.contenu),
      contenuContentType: new FormControl(supportDeCoursRawValue.contenuContentType),
      dateDepot: new FormControl(supportDeCoursRawValue.dateDepot),
      filiere: new FormControl(supportDeCoursRawValue.filiere),
      niveau: new FormControl(supportDeCoursRawValue.niveau),
      matiere: new FormControl(supportDeCoursRawValue.matiere),
    });
  }

  getSupportDeCours(form: SupportDeCoursFormGroup): ISupportDeCours | NewSupportDeCours {
    return this.convertSupportDeCoursRawValueToSupportDeCours(
      form.getRawValue() as SupportDeCoursFormRawValue | NewSupportDeCoursFormRawValue
    );
  }

  resetForm(form: SupportDeCoursFormGroup, supportDeCours: SupportDeCoursFormGroupInput): void {
    const supportDeCoursRawValue = this.convertSupportDeCoursToSupportDeCoursRawValue({ ...this.getFormDefaults(), ...supportDeCours });
    form.reset(
      {
        ...supportDeCoursRawValue,
        id: { value: supportDeCoursRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SupportDeCoursFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateDepot: currentTime,
    };
  }

  private convertSupportDeCoursRawValueToSupportDeCours(
    rawSupportDeCours: SupportDeCoursFormRawValue | NewSupportDeCoursFormRawValue
  ): ISupportDeCours | NewSupportDeCours {
    return {
      ...rawSupportDeCours,
      dateDepot: dayjs(rawSupportDeCours.dateDepot, DATE_TIME_FORMAT),
    };
  }

  private convertSupportDeCoursToSupportDeCoursRawValue(
    supportDeCours: ISupportDeCours | (Partial<NewSupportDeCours> & SupportDeCoursFormDefaults)
  ): SupportDeCoursFormRawValue | PartialWithRequiredKeyOf<NewSupportDeCoursFormRawValue> {
    return {
      ...supportDeCours,
      dateDepot: supportDeCours.dateDepot ? supportDeCours.dateDepot.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
