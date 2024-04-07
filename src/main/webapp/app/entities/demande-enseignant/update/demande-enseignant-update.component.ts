import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DemandeEnseignantFormService, DemandeEnseignantFormGroup } from './demande-enseignant-form.service';
import { IDemandeEnseignant } from '../demande-enseignant.model';
import { DemandeEnseignantService } from '../service/demande-enseignant.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { SujetEns } from 'app/entities/enumerations/sujet-ens.model';
import { Status } from 'app/entities/enumerations/status.model';

import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  standalone: true,
  selector: 'jhi-demande-enseignant-update',
  templateUrl: './demande-enseignant-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, HasAnyAuthorityDirective],
})
export class DemandeEnseignantUpdateComponent implements OnInit {
  isSaving = false;
  demandeEnseignant: IDemandeEnseignant | null = null;
  sujetEnsValues = Object.keys(SujetEns);
  statusValues = Object.keys(Status);
  selectedSujet: any = null;
  description: any = null;
  currentAccount: Account | null = null;
  prop: any = null;
  stat = 'EnAttente';

  editForm: DemandeEnseignantFormGroup = this.demandeEnseignantFormService.createDemandeEnseignantFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected demandeEnseignantService: DemandeEnseignantService,
    protected demandeEnseignantFormService: DemandeEnseignantFormService,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ demandeEnseignant }) => {
      this.demandeEnseignant = demandeEnseignant;
      if (demandeEnseignant) {
        this.updateForm(demandeEnseignant);
      }
    });
    this.accountService.identity().subscribe(account => (this.currentAccount = account));
    this.prop = this.currentAccount?.email;
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
    const demandeEnseignant = this.demandeEnseignantFormService.getDemandeEnseignant(this.editForm);
    if (demandeEnseignant.id !== null) {
      this.subscribeToSaveResponse(this.demandeEnseignantService.update(demandeEnseignant));
    } else {
      this.subscribeToSaveResponse(this.demandeEnseignantService.create(demandeEnseignant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDemandeEnseignant>>): void {
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

  protected updateForm(demandeEnseignant: IDemandeEnseignant): void {
    this.demandeEnseignant = demandeEnseignant;
    this.selectedSujet = demandeEnseignant.sujet;
    this.description = demandeEnseignant.description;
    this.demandeEnseignantFormService.resetForm(this.editForm, demandeEnseignant);
  }
}
