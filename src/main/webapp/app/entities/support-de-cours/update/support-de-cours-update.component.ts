import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SupportDeCoursFormService, SupportDeCoursFormGroup } from './support-de-cours-form.service';
import { ISupportDeCours } from '../support-de-cours.model';
import { SupportDeCoursService } from '../service/support-de-cours.service';
import { IMatiere } from 'app/entities/matiere/matiere.model';
import { MatiereService } from 'app/entities/matiere/service/matiere.service';

@Component({
  standalone: true,
  selector: 'jhi-support-de-cours-update',
  templateUrl: './support-de-cours-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SupportDeCoursUpdateComponent implements OnInit {
  isSaving = false;
  supportDeCours: ISupportDeCours | null = null;

  matieresSharedCollection: IMatiere[] = [];

  editForm: SupportDeCoursFormGroup = this.supportDeCoursFormService.createSupportDeCoursFormGroup();

  constructor(
    protected supportDeCoursService: SupportDeCoursService,
    protected supportDeCoursFormService: SupportDeCoursFormService,
    protected matiereService: MatiereService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMatiere = (o1: IMatiere | null, o2: IMatiere | null): boolean => this.matiereService.compareMatiere(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ supportDeCours }) => {
      this.supportDeCours = supportDeCours;
      if (supportDeCours) {
        this.updateForm(supportDeCours);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const supportDeCours = this.supportDeCoursFormService.getSupportDeCours(this.editForm);
    if (supportDeCours.id !== null) {
      this.subscribeToSaveResponse(this.supportDeCoursService.update(supportDeCours));
    } else {
      this.subscribeToSaveResponse(this.supportDeCoursService.create(supportDeCours));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISupportDeCours>>): void {
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

  protected updateForm(supportDeCours: ISupportDeCours): void {
    this.supportDeCours = supportDeCours;
    this.supportDeCoursFormService.resetForm(this.editForm, supportDeCours);

    this.matieresSharedCollection = this.matiereService.addMatiereToCollectionIfMissing<IMatiere>(
      this.matieresSharedCollection,
      supportDeCours.nomMatiere
    );
  }

  protected loadRelationshipsOptions(): void {
    this.matiereService
      .query()
      .pipe(map((res: HttpResponse<IMatiere[]>) => res.body ?? []))
      .pipe(
        map((matieres: IMatiere[]) =>
          this.matiereService.addMatiereToCollectionIfMissing<IMatiere>(matieres, this.supportDeCours?.nomMatiere)
        )
      )
      .subscribe((matieres: IMatiere[]) => (this.matieresSharedCollection = matieres));
  }
}
