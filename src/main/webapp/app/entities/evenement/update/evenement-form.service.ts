import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEvenement, NewEvenement } from '../evenement.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEvenement for edit and NewEvenementFormGroupInput for create.
 */
type EvenementFormGroupInput = IEvenement | PartialWithRequiredKeyOf<NewEvenement>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEvenement | NewEvenement> = Omit<T, 'dateDebut' | 'dateFin'> & {
  dateDebut?: string | null;
  dateFin?: string | null;
};

type EvenementFormRawValue = FormValueOf<IEvenement>;

type NewEvenementFormRawValue = FormValueOf<NewEvenement>;

type EvenementFormDefaults = Pick<NewEvenement, 'id' | 'dateDebut' | 'dateFin' | 'partenaires'>;

type EvenementFormGroupContent = {
  id: FormControl<EvenementFormRawValue['id'] | NewEvenement['id']>;
  titre: FormControl<EvenementFormRawValue['titre']>;
  description: FormControl<EvenementFormRawValue['description']>;
  dateDebut: FormControl<EvenementFormRawValue['dateDebut']>;
  dateFin: FormControl<EvenementFormRawValue['dateFin']>;
  lieu: FormControl<EvenementFormRawValue['lieu']>;
  partenaires: FormControl<EvenementFormRawValue['partenaires']>;
};

export type EvenementFormGroup = FormGroup<EvenementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EvenementFormService {
  createEvenementFormGroup(evenement: EvenementFormGroupInput = { id: null }): EvenementFormGroup {
    const evenementRawValue = this.convertEvenementToEvenementRawValue({
      ...this.getFormDefaults(),
      ...evenement,
    });
    return new FormGroup<EvenementFormGroupContent>({
      id: new FormControl(
        { value: evenementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      titre: new FormControl(evenementRawValue.titre),
      description: new FormControl(evenementRawValue.description),
      dateDebut: new FormControl(evenementRawValue.dateDebut),
      dateFin: new FormControl(evenementRawValue.dateFin),
      lieu: new FormControl(evenementRawValue.lieu),
      partenaires: new FormControl(evenementRawValue.partenaires ?? []),
    });
  }

  getEvenement(form: EvenementFormGroup): IEvenement | NewEvenement {
    return this.convertEvenementRawValueToEvenement(form.getRawValue() as EvenementFormRawValue | NewEvenementFormRawValue);
  }

  resetForm(form: EvenementFormGroup, evenement: EvenementFormGroupInput): void {
    const evenementRawValue = this.convertEvenementToEvenementRawValue({ ...this.getFormDefaults(), ...evenement });
    form.reset(
      {
        ...evenementRawValue,
        id: { value: evenementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EvenementFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateDebut: currentTime,
      dateFin: currentTime,
      partenaires: [],
    };
  }

  private convertEvenementRawValueToEvenement(rawEvenement: EvenementFormRawValue | NewEvenementFormRawValue): IEvenement | NewEvenement {
    return {
      ...rawEvenement,
      dateDebut: dayjs(rawEvenement.dateDebut, DATE_TIME_FORMAT),
      dateFin: dayjs(rawEvenement.dateFin, DATE_TIME_FORMAT),
    };
  }

  private convertEvenementToEvenementRawValue(
    evenement: IEvenement | (Partial<NewEvenement> & EvenementFormDefaults)
  ): EvenementFormRawValue | PartialWithRequiredKeyOf<NewEvenementFormRawValue> {
    return {
      ...evenement,
      dateDebut: evenement.dateDebut ? evenement.dateDebut.format(DATE_TIME_FORMAT) : undefined,
      dateFin: evenement.dateFin ? evenement.dateFin.format(DATE_TIME_FORMAT) : undefined,
      partenaires: evenement.partenaires ?? [],
    };
  }
}
