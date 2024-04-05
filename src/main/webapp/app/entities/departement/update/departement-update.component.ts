import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DepartementFormService, DepartementFormGroup } from './departement-form.service';
import { IDepartement } from '../departement.model';
import { DepartementService } from '../service/departement.service';
import { IEnseignant } from 'app/entities/enseignant/enseignant.model';
import { EnseignantService } from 'app/entities/enseignant/service/enseignant.service';

import { NOM_DEPARTEMENT_ALREADY_USED_TYPE } from 'app/config/error.constants';

@Component({
  standalone: true,
  selector: 'jhi-departement-update',
  templateUrl: './departement-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class DepartementUpdateComponent implements OnInit {
  isSaving = false;
  departement: IDepartement | null = null;
  errorNomExists = false;

  enseignantsCollection: IEnseignant[] = [];

  editForm: DepartementFormGroup = this.departementFormService.createDepartementFormGroup();

  constructor(
    protected departementService: DepartementService,
    protected departementFormService: DepartementFormService,
    protected enseignantService: EnseignantService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEnseignant = (o1: IEnseignant | null, o2: IEnseignant | null): boolean => this.enseignantService.compareEnseignant(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ departement }) => {
      this.departement = departement;
      if (departement) {
        this.updateForm(departement);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.errorNomExists = false;
    this.isSaving = true;
    const departement = this.departementFormService.getDepartement(this.editForm);
    if (departement.id !== null) {
      this.subscribeToSaveResponse(this.departementService.update(departement));
    } else {
      this.subscribeToSaveResponse(this.departementService.create(departement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepartement>>): void {
    result.subscribe(
      (res: HttpResponse<IDepartement>) => {
        this.onSaveSuccess();
      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 400 && errorResponse.error.type === NOM_DEPARTEMENT_ALREADY_USED_TYPE) {
          // nom existe déjà
          this.errorNomExists = true;
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

  protected updateForm(departement: IDepartement): void {
    this.departement = departement;
    this.departementFormService.resetForm(this.editForm, departement);

    this.enseignantsCollection = this.enseignantService.addEnseignantToCollectionIfMissing<IEnseignant>(
      this.enseignantsCollection,
      departement.enseignant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.enseignantService
      .query({ filter: 'departement-is-null' })
      .pipe(map((res: HttpResponse<IEnseignant[]>) => res.body ?? []))
      .pipe(
        map((enseignants: IEnseignant[]) =>
          this.enseignantService.addEnseignantToCollectionIfMissing<IEnseignant>(enseignants, this.departement?.enseignant)
        )
      )
      .subscribe((enseignants: IEnseignant[]) => (this.enseignantsCollection = enseignants));
  }
}
