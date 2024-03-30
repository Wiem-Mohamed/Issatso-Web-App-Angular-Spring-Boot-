import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OffreStageFormService, OffreStageFormGroup } from './offre-stage-form.service';
import { IOffreStage } from '../offre-stage.model';
import { OffreStageService } from '../service/offre-stage.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IDepartement } from 'app/entities/departement/departement.model';
import { DepartementService } from 'app/entities/departement/service/departement.service';
import { Domaine } from 'app/entities/enumerations/domaine.model';

@Component({
  standalone: true,
  selector: 'jhi-offre-stage-update',
  templateUrl: './offre-stage-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OffreStageUpdateComponent implements OnInit {
  isSaving = false;
  offreStage: IOffreStage | null = null;
  domaineValues = Object.keys(Domaine);

  departementsSharedCollection: IDepartement[] = [];

  editForm: OffreStageFormGroup = this.offreStageFormService.createOffreStageFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected offreStageService: OffreStageService,
    protected offreStageFormService: OffreStageFormService,
    protected departementService: DepartementService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDepartement = (o1: IDepartement | null, o2: IDepartement | null): boolean => this.departementService.compareDepartement(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offreStage }) => {
      this.offreStage = offreStage;
      if (offreStage) {
        this.updateForm(offreStage);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('issatsoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const offreStage = this.offreStageFormService.getOffreStage(this.editForm);
    if (offreStage.id !== null) {
      this.subscribeToSaveResponse(this.offreStageService.update(offreStage));
    } else {
      this.subscribeToSaveResponse(this.offreStageService.create(offreStage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffreStage>>): void {
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

  protected updateForm(offreStage: IOffreStage): void {
    this.offreStage = offreStage;
    this.offreStageFormService.resetForm(this.editForm, offreStage);

    this.departementsSharedCollection = this.departementService.addDepartementToCollectionIfMissing<IDepartement>(
      this.departementsSharedCollection,
      offreStage.departement
    );
  }

  protected loadRelationshipsOptions(): void {
    this.departementService
      .query()
      .pipe(map((res: HttpResponse<IDepartement[]>) => res.body ?? []))
      .pipe(
        map((departements: IDepartement[]) =>
          this.departementService.addDepartementToCollectionIfMissing<IDepartement>(departements, this.offreStage?.departement)
        )
      )
      .subscribe((departements: IDepartement[]) => (this.departementsSharedCollection = departements));
  }
}
