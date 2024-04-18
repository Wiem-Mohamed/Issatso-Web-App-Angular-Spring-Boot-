import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EtudiantFormService, EtudiantFormGroup } from './etudiant-form.service';
import { IEtudiant } from '../etudiant.model';
import { EtudiantService } from '../service/etudiant.service';
import { IGroupe } from 'app/entities/groupe/groupe.model';
import { GroupeService } from 'app/entities/groupe/service/groupe.service';
import { Filiere } from 'app/entities/enumerations/filiere.model';
import { NUMINSCRIPTION_ALREADY_USED_TYPE } from 'app/config/error.constants';

@Component({
  standalone: true,
  selector: 'jhi-etudiant-update',
  templateUrl: './etudiant-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EtudiantUpdateComponent implements OnInit {
  isSaving = false;
  etudiant: IEtudiant | null = null;
  filiereValues = Object.keys(Filiere);
  errorNumInscritExists = false;
  firstvalue: number = 1;
  groupesSharedCollection: IGroupe[] = [];

  editForm: EtudiantFormGroup = this.etudiantFormService.createEtudiantFormGroup();

  constructor(
    protected etudiantService: EtudiantService,
    protected etudiantFormService: EtudiantFormService,
    protected groupeService: GroupeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareGroupe = (o1: IGroupe | null, o2: IGroupe | null): boolean => this.groupeService.compareGroupe(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etudiant }) => {
      this.etudiant = etudiant;
      if (etudiant) {
        this.updateForm(etudiant);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.errorNumInscritExists = false;
    this.isSaving = true;
    const etudiant = this.etudiantFormService.getEtudiant(this.editForm);
    if (etudiant.id !== null) {
      this.subscribeToSaveResponse(this.etudiantService.update(etudiant));
    } else {
      this.subscribeToSaveResponse(this.etudiantService.create(etudiant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtudiant>>): void {
    result.subscribe(
      (res: HttpResponse<IEtudiant>) => {
        this.onSaveSuccess();
      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 400 && errorResponse.error.type === NUMINSCRIPTION_ALREADY_USED_TYPE) {
          // num inscrit existe déjà
          this.errorNumInscritExists = true;
        } else {
          this.onSaveError();
        }
        this.onSaveFinalize();
      }
    );
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

  protected updateForm(etudiant: IEtudiant): void {
    this.etudiant = etudiant;
    this.etudiantFormService.resetForm(this.editForm, etudiant);

    this.groupesSharedCollection = this.groupeService.addGroupeToCollectionIfMissing<IGroupe>(
      this.groupesSharedCollection,
      etudiant.groupe
    );
  }

  protected loadRelationshipsOptions(): void {
    this.groupeService
      .query()
      .pipe(map((res: HttpResponse<IGroupe[]>) => res.body ?? []))
      .pipe(map((groupes: IGroupe[]) => this.groupeService.addGroupeToCollectionIfMissing<IGroupe>(groupes, this.etudiant?.groupe)))
      .subscribe((groupes: IGroupe[]) => (this.groupesSharedCollection = groupes));
  }
}
