import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatiereFormService, MatiereFormGroup } from './matiere-form.service';
import { IMatiere } from '../matiere.model';
import { MatiereService } from '../service/matiere.service';
import { IEnseignant } from 'app/entities/enseignant/enseignant.model';
import { EnseignantService } from 'app/entities/enseignant/service/enseignant.service';

@Component({
  standalone: true,
  selector: 'jhi-matiere-update',
  templateUrl: './matiere-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MatiereUpdateComponent implements OnInit {
  isSaving = false;
  matiere: IMatiere | null = null;

  enseignantsSharedCollection: IEnseignant[] = [];

  editForm: MatiereFormGroup = this.matiereFormService.createMatiereFormGroup();

  constructor(
    protected matiereService: MatiereService,
    protected matiereFormService: MatiereFormService,
    protected enseignantService: EnseignantService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEnseignant = (o1: IEnseignant | null, o2: IEnseignant | null): boolean => this.enseignantService.compareEnseignant(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ matiere }) => {
      this.matiere = matiere;
      if (matiere) {
        this.updateForm(matiere);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const matiere = this.matiereFormService.getMatiere(this.editForm);
    if (matiere.id !== null) {
      this.subscribeToSaveResponse(this.matiereService.update(matiere));
    } else {
      this.subscribeToSaveResponse(this.matiereService.create(matiere));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMatiere>>): void {
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

  protected updateForm(matiere: IMatiere): void {
    this.matiere = matiere;
    this.matiereFormService.resetForm(this.editForm, matiere);

    this.enseignantsSharedCollection = this.enseignantService.addEnseignantToCollectionIfMissing<IEnseignant>(
      this.enseignantsSharedCollection,
      matiere.enseignant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.enseignantService
      .query()
      .pipe(map((res: HttpResponse<IEnseignant[]>) => res.body ?? []))
      .pipe(
        map((enseignants: IEnseignant[]) =>
          this.enseignantService.addEnseignantToCollectionIfMissing<IEnseignant>(enseignants, this.matiere?.enseignant)
        )
      )
      .subscribe((enseignants: IEnseignant[]) => (this.enseignantsSharedCollection = enseignants));
  }
}
