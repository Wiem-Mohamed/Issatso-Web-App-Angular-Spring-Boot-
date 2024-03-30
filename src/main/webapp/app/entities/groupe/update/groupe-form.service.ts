import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGroupe, NewGroupe } from '../groupe.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGroupe for edit and NewGroupeFormGroupInput for create.
 */
type GroupeFormGroupInput = IGroupe | PartialWithRequiredKeyOf<NewGroupe>;

type GroupeFormDefaults = Pick<NewGroupe, 'id' | 'enseigants'>;

type GroupeFormGroupContent = {
  id: FormControl<IGroupe['id'] | NewGroupe['id']>;
  nomGroupe: FormControl<IGroupe['nomGroupe']>;
  filiere: FormControl<IGroupe['filiere']>;
  enseigants: FormControl<IGroupe['enseigants']>;
};

export type GroupeFormGroup = FormGroup<GroupeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GroupeFormService {
  createGroupeFormGroup(groupe: GroupeFormGroupInput = { id: null }): GroupeFormGroup {
    const groupeRawValue = {
      ...this.getFormDefaults(),
      ...groupe,
    };
    return new FormGroup<GroupeFormGroupContent>({
      id: new FormControl(
        { value: groupeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nomGroupe: new FormControl(groupeRawValue.nomGroupe),
      filiere: new FormControl(groupeRawValue.filiere),
      enseigants: new FormControl(groupeRawValue.enseigants ?? []),
    });
  }

  getGroupe(form: GroupeFormGroup): IGroupe | NewGroupe {
    return form.getRawValue() as IGroupe | NewGroupe;
  }

  resetForm(form: GroupeFormGroup, groupe: GroupeFormGroupInput): void {
    const groupeRawValue = { ...this.getFormDefaults(), ...groupe };
    form.reset(
      {
        ...groupeRawValue,
        id: { value: groupeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GroupeFormDefaults {
    return {
      id: null,
      enseigants: [],
    };
  }
}
