import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOffreStage, NewOffreStage } from '../offre-stage.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOffreStage for edit and NewOffreStageFormGroupInput for create.
 */
type OffreStageFormGroupInput = IOffreStage | PartialWithRequiredKeyOf<NewOffreStage>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IOffreStage | NewOffreStage> = Omit<T, 'dateDebut' | 'dateFin'> & {
  dateDebut?: string | null;
  dateFin?: string | null;
};

type OffreStageFormRawValue = FormValueOf<IOffreStage>;

type NewOffreStageFormRawValue = FormValueOf<NewOffreStage>;

type OffreStageFormDefaults = Pick<NewOffreStage, 'id' | 'dateDebut' | 'dateFin'>;

type OffreStageFormGroupContent = {
  id: FormControl<OffreStageFormRawValue['id'] | NewOffreStage['id']>;
  titre: FormControl<OffreStageFormRawValue['titre']>;
  description: FormControl<OffreStageFormRawValue['description']>;
  domaine: FormControl<OffreStageFormRawValue['domaine']>;
  dateDebut: FormControl<OffreStageFormRawValue['dateDebut']>;
  dateFin: FormControl<OffreStageFormRawValue['dateFin']>;
  entreprise: FormControl<OffreStageFormRawValue['entreprise']>;
  lieu: FormControl<OffreStageFormRawValue['lieu']>;
  departement: FormControl<OffreStageFormRawValue['departement']>;
};

export type OffreStageFormGroup = FormGroup<OffreStageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OffreStageFormService {
  createOffreStageFormGroup(offreStage: OffreStageFormGroupInput = { id: null }): OffreStageFormGroup {
    const offreStageRawValue = this.convertOffreStageToOffreStageRawValue({
      ...this.getFormDefaults(),
      ...offreStage,
    });
    return new FormGroup<OffreStageFormGroupContent>({
      id: new FormControl(
        { value: offreStageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      titre: new FormControl(offreStageRawValue.titre),
      description: new FormControl(offreStageRawValue.description),
      domaine: new FormControl(offreStageRawValue.domaine),
      dateDebut: new FormControl(offreStageRawValue.dateDebut),
      dateFin: new FormControl(offreStageRawValue.dateFin),
      entreprise: new FormControl(offreStageRawValue.entreprise),
      lieu: new FormControl(offreStageRawValue.lieu),
      departement: new FormControl(offreStageRawValue.departement),
    });
  }

  getOffreStage(form: OffreStageFormGroup): IOffreStage | NewOffreStage {
    return this.convertOffreStageRawValueToOffreStage(form.getRawValue() as OffreStageFormRawValue | NewOffreStageFormRawValue);
  }

  resetForm(form: OffreStageFormGroup, offreStage: OffreStageFormGroupInput): void {
    const offreStageRawValue = this.convertOffreStageToOffreStageRawValue({ ...this.getFormDefaults(), ...offreStage });
    form.reset(
      {
        ...offreStageRawValue,
        id: { value: offreStageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OffreStageFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateDebut: currentTime,
      dateFin: currentTime,
    };
  }

  private convertOffreStageRawValueToOffreStage(
    rawOffreStage: OffreStageFormRawValue | NewOffreStageFormRawValue
  ): IOffreStage | NewOffreStage {
    return {
      ...rawOffreStage,
      dateDebut: dayjs(rawOffreStage.dateDebut, DATE_TIME_FORMAT),
      dateFin: dayjs(rawOffreStage.dateFin, DATE_TIME_FORMAT),
    };
  }

  private convertOffreStageToOffreStageRawValue(
    offreStage: IOffreStage | (Partial<NewOffreStage> & OffreStageFormDefaults)
  ): OffreStageFormRawValue | PartialWithRequiredKeyOf<NewOffreStageFormRawValue> {
    return {
      ...offreStage,
      dateDebut: offreStage.dateDebut ? offreStage.dateDebut.format(DATE_TIME_FORMAT) : undefined,
      dateFin: offreStage.dateFin ? offreStage.dateFin.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
