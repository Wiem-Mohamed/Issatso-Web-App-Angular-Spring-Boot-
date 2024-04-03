import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EnseignantFormService, EnseignantFormGroup } from './enseignant-form.service';
import { IEnseignant } from '../enseignant.model';
import { EnseignantService } from '../service/enseignant.service';
import { IGroupe } from 'app/entities/groupe/groupe.model';
import { GroupeService } from 'app/entities/groupe/service/groupe.service';
import { Grade } from 'app/entities/enumerations/grade.model';

import { CIN_ALREADY_USED_TYPE } from 'app/config/error.constants';

@Component({
  standalone: true,
  selector: 'jhi-enseignant-update',
  templateUrl: './enseignant-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EnseignantUpdateComponent implements OnInit {
  isSaving = false;
  enseignant: IEnseignant | null = null;
  gradeValues = Object.keys(Grade);
  errorCinExists = false;

  groupesSharedCollection: IGroupe[] = [];

  editForm: EnseignantFormGroup = this.enseignantFormService.createEnseignantFormGroup();

  constructor(
    protected enseignantService: EnseignantService,
    protected enseignantFormService: EnseignantFormService,
    protected groupeService: GroupeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareGroupe = (o1: IGroupe | null, o2: IGroupe | null): boolean => this.groupeService.compareGroupe(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ enseignant }) => {
      this.enseignant = enseignant;
      if (enseignant) {
        this.updateForm(enseignant);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.errorCinExists = false;
    this.isSaving = true;
    const enseignant = this.enseignantFormService.getEnseignant(this.editForm);
    if (enseignant.id !== null) {
      this.subscribeToSaveResponse(this.enseignantService.update(enseignant));
    } else {
      this.subscribeToSaveResponse(this.enseignantService.create(enseignant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEnseignant>>): void {
    result.subscribe(
      (res: HttpResponse<IEnseignant>) => {
        this.onSaveSuccess();
      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 400 && errorResponse.error.type === CIN_ALREADY_USED_TYPE) {
          // Le code-barres existe déjà
          this.errorCinExists = true;
        } else {
          this.onSaveError();
        }
        this.onSaveFinalize();
      }
    );
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

  protected updateForm(enseignant: IEnseignant): void {
    this.enseignant = enseignant;
    this.enseignantFormService.resetForm(this.editForm, enseignant);

    this.groupesSharedCollection = this.groupeService.addGroupeToCollectionIfMissing<IGroupe>(
      this.groupesSharedCollection,
      ...(enseignant.groupes ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.groupeService
      .query()
      .pipe(map((res: HttpResponse<IGroupe[]>) => res.body ?? []))
      .pipe(
        map((groupes: IGroupe[]) =>
          this.groupeService.addGroupeToCollectionIfMissing<IGroupe>(groupes, ...(this.enseignant?.groupes ?? []))
        )
      )
      .subscribe((groupes: IGroupe[]) => (this.groupesSharedCollection = groupes));
  }
}
