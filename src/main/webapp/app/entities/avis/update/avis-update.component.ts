import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AvisFormService, AvisFormGroup } from './avis-form.service';
import { IAvis } from '../avis.model';
import { AvisService } from '../service/avis.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  standalone: true,
  selector: 'jhi-avis-update',
  templateUrl: './avis-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AvisUpdateComponent implements OnInit {
  isSaving = false;
  avis: IAvis | null = null;

  editForm: AvisFormGroup = this.avisFormService.createAvisFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected avisService: AvisService,
    protected avisFormService: AvisFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ avis }) => {
      this.avis = avis;
      if (avis) {
        this.updateForm(avis);
      }
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
    const avis = this.avisFormService.getAvis(this.editForm);
    if (avis.id !== null) {
      this.subscribeToSaveResponse(this.avisService.update(avis));
    } else {
      this.subscribeToSaveResponse(this.avisService.create(avis));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAvis>>): void {
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

  protected updateForm(avis: IAvis): void {
    this.avis = avis;
    this.avisFormService.resetForm(this.editForm, avis);
  }
}
