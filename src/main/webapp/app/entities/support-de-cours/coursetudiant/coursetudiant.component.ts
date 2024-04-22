import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterLink, RouterModule } from '@angular/router';
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
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';
import { AccountService } from '../../../core/auth/account.service';
import { MatiereService } from '../../matiere/service/matiere.service';
import { IMatiere } from '../../matiere/matiere.model';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { EtudiantService } from '../../etudiant/service/etudiant.service';
import { IEtudiant } from '../../etudiant/etudiant.model';
import { Filiere } from '../../enumerations/filiere.model';
@Component({
  standalone: true,
  templateUrl: './coursetudiant.component.html',
  styleUrls: ['./coursetudiant.component.scss'],
  imports: [SharedModule, FormsModule, FormatMediumDatetimePipe, SortDirective, HasAnyAuthorityDirective, SortByDirective, RouterLink],
})
export class CoursetudiantComponent {
  supportDeCours?: ISupportDeCours[];
  isLoading = false;
  predicate = 'id';
  ascending = true;
  login!: String | undefined;
  idtest!: number;
  filiere?: String;

  constructor(
    protected supportDeCoursService: SupportDeCoursService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected dataUtils: DataUtils,
    protected accountService: AccountService,
    protected etudiantService: EtudiantService
  ) {}

  trackId = (_index: number, item: ISupportDeCours): number => this.supportDeCoursService.getSupportDeCoursIdentifier(item);

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.login = account?.email;
      console.log('coursetudiantts', this.login); // Log de l'adresse email récupérée
    });

    if (this.login !== undefined) {
      this.etudiantService.getIdEtudiantConnecte(this.login).subscribe(
        (id: number) => {
          this.idtest = id;
          console.log('coursetudiantts', this.idtest); // Log de l'ID de l'étudiant récupéré
          this.etudiantService.getEtudiantFiliere(this.idtest).subscribe(
            (f: String) => {
              return (this.filiere = f);
            },
            (error: any) => {
              console.error("Une erreur s'est produite lors de la récupération de la filière de l'étudiant :", error);
            }
          );
        },
        (error: any) => {
          console.error("Une erreur s'est produite lors de la récupération de l'ID de l'étudiant connecté :", error);
        }
      );
    } else {
      console.error("Erreur : L'adresse e-mail n'est pas définie.");
    }
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

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }
  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = params.get(SORT) ?? data[DEFAULT_SORT_DATA];
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.supportDeCours = this.refineData(dataFromBody);
  }

  protected refineData(data: ISupportDeCours[]): ISupportDeCours[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
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
}
