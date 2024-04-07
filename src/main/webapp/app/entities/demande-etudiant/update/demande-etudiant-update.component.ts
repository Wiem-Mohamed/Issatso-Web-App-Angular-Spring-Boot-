import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DemandeEtudiantFormService, DemandeEtudiantFormGroup } from './demande-etudiant-form.service';
import { IDemandeEtudiant } from '../demande-etudiant.model';
import { DemandeEtudiantService } from '../service/demande-etudiant.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { SujetEtud } from 'app/entities/enumerations/sujet-etud.model';
import { Status } from 'app/entities/enumerations/status.model';

import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  standalone: true,
  selector: 'jhi-demande-etudiant-update',
  templateUrl: './demande-etudiant-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, HasAnyAuthorityDirective],
})
export class DemandeEtudiantUpdateComponent implements OnInit {
  isSaving = false;
  demandeEtudiant: IDemandeEtudiant | null = null;
  sujetEtudValues = Object.keys(SujetEtud);
  statusValues = Object.keys(Status);
  selectedSujet: any = null;
  description: any = null;
  currentAccount: Account | null = null;
  prop: any = null;
  stat = 'EnAttente';

  editForm: DemandeEtudiantFormGroup = this.demandeEtudiantFormService.createDemandeEtudiantFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected demandeEtudiantService: DemandeEtudiantService,
    protected demandeEtudiantFormService: DemandeEtudiantFormService,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ demandeEtudiant }) => {
      this.demandeEtudiant = demandeEtudiant;
      if (demandeEtudiant) {
        this.updateForm(demandeEtudiant);
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
    const demandeEtudiant = this.demandeEtudiantFormService.getDemandeEtudiant(this.editForm);
    if (demandeEtudiant.id !== null) {
      this.subscribeToSaveResponse(this.demandeEtudiantService.update(demandeEtudiant));
    } else {
      this.subscribeToSaveResponse(this.demandeEtudiantService.create(demandeEtudiant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDemandeEtudiant>>): void {
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

  protected updateForm(demandeEtudiant: IDemandeEtudiant): void {
    this.demandeEtudiant = demandeEtudiant;
    this.selectedSujet = demandeEtudiant.sujet;
    this.description = demandeEtudiant.description;
    this.demandeEtudiantFormService.resetForm(this.editForm, demandeEtudiant);
  }
}
