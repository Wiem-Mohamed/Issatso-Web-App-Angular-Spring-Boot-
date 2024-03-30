import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PartenaireFormService, PartenaireFormGroup } from './partenaire-form.service';
import { IPartenaire } from '../partenaire.model';
import { PartenaireService } from '../service/partenaire.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IEvenement } from 'app/entities/evenement/evenement.model';
import { EvenementService } from 'app/entities/evenement/service/evenement.service';

@Component({
  standalone: true,
  selector: 'jhi-partenaire-update',
  templateUrl: './partenaire-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PartenaireUpdateComponent implements OnInit {
  isSaving = false;
  partenaire: IPartenaire | null = null;

  evenementsSharedCollection: IEvenement[] = [];

  editForm: PartenaireFormGroup = this.partenaireFormService.createPartenaireFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected partenaireService: PartenaireService,
    protected partenaireFormService: PartenaireFormService,
    protected evenementService: EvenementService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEvenement = (o1: IEvenement | null, o2: IEvenement | null): boolean => this.evenementService.compareEvenement(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partenaire }) => {
      this.partenaire = partenaire;
      if (partenaire) {
        this.updateForm(partenaire);
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
    const partenaire = this.partenaireFormService.getPartenaire(this.editForm);
    if (partenaire.id !== null) {
      this.subscribeToSaveResponse(this.partenaireService.update(partenaire));
    } else {
      this.subscribeToSaveResponse(this.partenaireService.create(partenaire));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPartenaire>>): void {
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

  protected updateForm(partenaire: IPartenaire): void {
    this.partenaire = partenaire;
    this.partenaireFormService.resetForm(this.editForm, partenaire);

    this.evenementsSharedCollection = this.evenementService.addEvenementToCollectionIfMissing<IEvenement>(
      this.evenementsSharedCollection,
      ...(partenaire.evenements ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.evenementService
      .query()
      .pipe(map((res: HttpResponse<IEvenement[]>) => res.body ?? []))
      .pipe(
        map((evenements: IEvenement[]) =>
          this.evenementService.addEvenementToCollectionIfMissing<IEvenement>(evenements, ...(this.partenaire?.evenements ?? []))
        )
      )
      .subscribe((evenements: IEvenement[]) => (this.evenementsSharedCollection = evenements));
  }
}
