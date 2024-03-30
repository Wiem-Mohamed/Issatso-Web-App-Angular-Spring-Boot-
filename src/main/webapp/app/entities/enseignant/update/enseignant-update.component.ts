import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
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

  enseignantsSharedCollection: IEnseignant[] = [];
  groupesSharedCollection: IGroupe[] = [];

  editForm: EnseignantFormGroup = this.enseignantFormService.createEnseignantFormGroup();

  constructor(
    protected enseignantService: EnseignantService,
    protected enseignantFormService: EnseignantFormService,
    protected groupeService: GroupeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEnseignant = (o1: IEnseignant | null, o2: IEnseignant | null): boolean => this.enseignantService.compareEnseignant(o1, o2);

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
    this.isSaving = true;
    const enseignant = this.enseignantFormService.getEnseignant(this.editForm);
    if (enseignant.id !== null) {
      this.subscribeToSaveResponse(this.enseignantService.update(enseignant));
    } else {
      this.subscribeToSaveResponse(this.enseignantService.create(enseignant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEnseignant>>): void {
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

  protected updateForm(enseignant: IEnseignant): void {
    this.enseignant = enseignant;
    this.enseignantFormService.resetForm(this.editForm, enseignant);

    this.enseignantsSharedCollection = this.enseignantService.addEnseignantToCollectionIfMissing<IEnseignant>(
      this.enseignantsSharedCollection,
      enseignant.chefDepartement
    );
    this.groupesSharedCollection = this.groupeService.addGroupeToCollectionIfMissing<IGroupe>(
      this.groupesSharedCollection,
      ...(enseignant.groupes ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.enseignantService
      .query()
      .pipe(map((res: HttpResponse<IEnseignant[]>) => res.body ?? []))
      .pipe(
        map((enseignants: IEnseignant[]) =>
          this.enseignantService.addEnseignantToCollectionIfMissing<IEnseignant>(enseignants, this.enseignant?.chefDepartement)
        )
      )
      .subscribe((enseignants: IEnseignant[]) => (this.enseignantsSharedCollection = enseignants));

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
