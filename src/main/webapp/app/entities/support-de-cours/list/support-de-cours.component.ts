import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { ISupportDeCours } from '../support-de-cours.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, SupportDeCoursService } from '../service/support-de-cours.service';
import { SupportDeCoursDeleteDialogComponent } from '../delete/support-de-cours-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';

import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { IMatiere } from '../../matiere/matiere.model';
import { MatiereService } from '../../matiere/service/matiere.service';
import { LoginService } from '../../../login/login.service';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  standalone: true,
  selector: 'jhi-support-de-cours',
  templateUrl: './support-de-cours.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    HasAnyAuthorityDirective,
  ],
})
export class SupportDeCoursComponent implements OnInit {
  supportDeCours?: ISupportDeCours[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  idtest!: number;
  matieresenseignant: IMatiere[] = [];

  constructor(
    protected supportDeCoursService: SupportDeCoursService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected matiereService: MatiereService,
    protected loginService: LoginService,
    protected accountService: AccountService
  ) {}
  login!: String | undefined;
  trackId = (_index: number, item: ISupportDeCours): number => this.supportDeCoursService.getSupportDeCoursIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.accountService.identity().subscribe(account => (this.login = account?.email));
    if (this.login !== undefined) {
      console.log('spcourst' + this.login);
      this.supportDeCoursService.getIdEnseigantConnecte(this.login).subscribe(
        (id: number) => {
          this.idtest = id;
          this.matiereService.findByEnseignantId(this.idtest).subscribe((matieres: IMatiere[]) => {
            this.matieresenseignant = matieres;
          });
          console.log('spcourst' + this.idtest);
          this.load();
        },
        (error: any) => {
          console.error("Une erreur s'est produite :", error);
        }
      );
    } else {
      console.error("Erreur : L'adresse e-mail n'est pas définie.");
    }
    this.matiereService.findByEnseignantId(this.idtest).subscribe((matieres: IMatiere[]) => {
      this.matieresenseignant = matieres;
    });

    this.load();
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.supportDeCours = this.refineData(dataFromBody, this.matieresenseignant);
  }

  protected refineData(data: ISupportDeCours[], matieresenseignant: IMatiere[]): ISupportDeCours[] {
    // Obtenez les IDs des matières associées à l'enseignant connecté
    const matiereIds = matieresenseignant.map(matiere => matiere.id);
    // Filtrez les supports de cours en fonction des matières associées à l'enseignant connecté
    return data.filter(supportDeCours => {
      if (supportDeCours.matiere && supportDeCours.matiere.id !== undefined) {
        return matiereIds.includes(supportDeCours.matiere.id);
      }
      return false;
    });
  }

  protected fillComponentAttributesFromResponseBody(data: ISupportDeCours[] | null): ISupportDeCours[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.supportDeCoursService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
  delete(supportDeCours: ISupportDeCours): void {
    const modalRef = this.modalService.open(SupportDeCoursDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.supportDeCours = supportDeCours;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }
}
