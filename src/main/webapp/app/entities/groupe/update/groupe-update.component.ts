import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GroupeFormService, GroupeFormGroup } from './groupe-form.service';
import { IGroupe } from '../groupe.model';
import { GroupeService } from '../service/groupe.service';
import { Filiere } from 'app/entities/enumerations/filiere.model';

@Component({
  standalone: true,
  selector: 'jhi-groupe-update',
  templateUrl: './groupe-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GroupeUpdateComponent implements OnInit {
  isSaving = false;
  groupe: IGroupe | null = null;
  filiereValues = Object.keys(Filiere);
  firstvalue: number = 1;

  editForm: GroupeFormGroup = this.groupeFormService.createGroupeFormGroup();

  constructor(
    protected groupeService: GroupeService,
    protected groupeFormService: GroupeFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ groupe }) => {
      this.groupe = groupe;
      if (groupe) {
        this.updateForm(groupe);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const groupe = this.groupeFormService.getGroupe(this.editForm);
    if (groupe.id !== null) {
      this.subscribeToSaveResponse(this.groupeService.update(groupe));
    } else {
      this.subscribeToSaveResponse(this.groupeService.create(groupe));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGroupe>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(groupe: IGroupe): void {
    this.groupe = groupe;
    this.groupeFormService.resetForm(this.editForm, groupe);
  }
}
