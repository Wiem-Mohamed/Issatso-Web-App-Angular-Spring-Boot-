import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPartenaire, NewPartenaire } from '../partenaire.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPartenaire for edit and NewPartenaireFormGroupInput for create.
 */
type PartenaireFormGroupInput = IPartenaire | PartialWithRequiredKeyOf<NewPartenaire>;

type PartenaireFormDefaults = Pick<NewPartenaire, 'id' | 'evenements'>;

type PartenaireFormGroupContent = {
  id: FormControl<IPartenaire['id'] | NewPartenaire['id']>;
  nom: FormControl<IPartenaire['nom']>;
  description: FormControl<IPartenaire['description']>;
  domaineActivite: FormControl<IPartenaire['domaineActivite']>;
  adresse: FormControl<IPartenaire['adresse']>;
  contact: FormControl<IPartenaire['contact']>;
  evenements: FormControl<IPartenaire['evenements']>;
};

export type PartenaireFormGroup = FormGroup<PartenaireFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PartenaireFormService {
  createPartenaireFormGroup(partenaire: PartenaireFormGroupInput = { id: null }): PartenaireFormGroup {
    const partenaireRawValue = {
      ...this.getFormDefaults(),
      ...partenaire,
    };
    return new FormGroup<PartenaireFormGroupContent>({
      id: new FormControl(
        { value: partenaireRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(partenaireRawValue.nom),
      description: new FormControl(partenaireRawValue.description),
      domaineActivite: new FormControl(partenaireRawValue.domaineActivite),
      adresse: new FormControl(partenaireRawValue.adresse),
      contact: new FormControl(partenaireRawValue.contact),
      evenements: new FormControl(partenaireRawValue.evenements ?? []),
    });
  }

  getPartenaire(form: PartenaireFormGroup): IPartenaire | NewPartenaire {
    return form.getRawValue() as IPartenaire | NewPartenaire;
  }

  resetForm(form: PartenaireFormGroup, partenaire: PartenaireFormGroupInput): void {
    const partenaireRawValue = { ...this.getFormDefaults(), ...partenaire };
    form.reset(
      {
        ...partenaireRawValue,
        id: { value: partenaireRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PartenaireFormDefaults {
    return {
      id: null,
      evenements: [],
    };
  }
}
