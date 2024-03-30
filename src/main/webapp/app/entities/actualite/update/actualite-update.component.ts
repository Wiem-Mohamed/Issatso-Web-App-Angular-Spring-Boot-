import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActualiteFormService, ActualiteFormGroup } from './actualite-form.service';
import { IActualite } from '../actualite.model';
import { ActualiteService } from '../service/actualite.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  standalone: true,
  selector: 'jhi-actualite-update',
  templateUrl: './actualite-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ActualiteUpdateComponent implements OnInit {
  isSaving = false;
  actualite: IActualite | null = null;

  editForm: ActualiteFormGroup = this.actualiteFormService.createActualiteFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected actualiteService: ActualiteService,
    protected actualiteFormService: ActualiteFormService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actualite }) => {
      this.actualite = actualite;
      if (actualite) {
        this.updateForm(actualite);
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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const actualite = this.actualiteFormService.getActualite(this.editForm);
    if (actualite.id !== null) {
      this.subscribeToSaveResponse(this.actualiteService.update(actualite));
    } else {
      this.subscribeToSaveResponse(this.actualiteService.create(actualite));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActualite>>): void {
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

  protected updateForm(actualite: IActualite): void {
    this.actualite = actualite;
    this.actualiteFormService.resetForm(this.editForm, actualite);
  }
}
