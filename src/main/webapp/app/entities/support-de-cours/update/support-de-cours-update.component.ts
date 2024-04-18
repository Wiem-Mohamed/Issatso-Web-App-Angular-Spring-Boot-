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
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IMatiere } from 'app/entities/matiere/matiere.model';
import { MatiereService } from 'app/entities/matiere/service/matiere.service';
import { Filiere } from 'app/entities/enumerations/filiere.model';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  standalone: true,
  selector: 'jhi-support-de-cours-update',
  templateUrl: './support-de-cours-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SupportDeCoursUpdateComponent implements OnInit {
  isSaving = false;
  firstvalue: number = 1;
  supportDeCours: ISupportDeCours | null = null;
  filiereValues = Object.keys(Filiere);
  matieresSharedCollection: IMatiere[] = [];
  matieresenseignant: IMatiere[] = [];
  editForm: SupportDeCoursFormGroup = this.supportDeCoursFormService.createSupportDeCoursFormGroup();
  login!: String | undefined;
  idtest!: number;
  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected supportDeCoursService: SupportDeCoursService,
    protected supportDeCoursFormService: SupportDeCoursFormService,
    protected matiereService: MatiereService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService
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
    this.accountService.identity().subscribe(account => (this.login = account?.email));
    if (this.login !== undefined) {
      this.supportDeCoursService.getIdEnseigantConnecte(this.login).subscribe(
        (id: number) => {
          this.idtest = id;
          this.matiereService.findByEnseignantId(this.idtest).subscribe((matieres: IMatiere[]) => {
            this.matieresenseignant = matieres;
          });
          console.log('spcourst' + this.idtest);
        },
        (error: any) => {
          console.error("Une erreur s'est produite :", error);
        }
      );
    } else {
      console.error("Erreur : L'adresse e-mail n'est pas définie.");
    }
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
      supportDeCours.matiere
    );
  }

  protected loadRelationshipsOptions(): void {
    this.matiereService
      .query()
      .pipe(map((res: HttpResponse<IMatiere[]>) => res.body ?? []))
      .pipe(
        map((matieres: IMatiere[]) => this.matiereService.addMatiereToCollectionIfMissing<IMatiere>(matieres, this.supportDeCours?.matiere))
      )
      .subscribe((matieres: IMatiere[]) => (this.matieresSharedCollection = matieres));
  }
}
