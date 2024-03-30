import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
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

@Component({
  standalone: true,
  selector: 'jhi-departement-update',
  templateUrl: './departement-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class DepartementUpdateComponent implements OnInit {
  isSaving = false;
  departement: IDepartement | null = null;

  chefDepartementsCollection: IEnseignant[] = [];

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
    this.isSaving = true;
    const departement = this.departementFormService.getDepartement(this.editForm);
    if (departement.id !== null) {
      this.subscribeToSaveResponse(this.departementService.update(departement));
    } else {
      this.subscribeToSaveResponse(this.departementService.create(departement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepartement>>): void {
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

  protected updateForm(departement: IDepartement): void {
    this.departement = departement;
    this.departementFormService.resetForm(this.editForm, departement);

    this.chefDepartementsCollection = this.enseignantService.addEnseignantToCollectionIfMissing<IEnseignant>(
      this.chefDepartementsCollection,
      departement.chefDepartement
    );
  }

  protected loadRelationshipsOptions(): void {
    this.enseignantService
      .query({ filter: 'departement-is-null' })
      .pipe(map((res: HttpResponse<IEnseignant[]>) => res.body ?? []))
      .pipe(
        map((enseignants: IEnseignant[]) =>
          this.enseignantService.addEnseignantToCollectionIfMissing<IEnseignant>(enseignants, this.departement?.chefDepartement)
        )
      )
      .subscribe((enseignants: IEnseignant[]) => (this.chefDepartementsCollection = enseignants));
  }
}
