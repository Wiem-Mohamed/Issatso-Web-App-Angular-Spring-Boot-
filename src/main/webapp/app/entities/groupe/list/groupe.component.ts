import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { IGroupe } from '../groupe.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, GroupeService } from '../service/groupe.service';
import { GroupeDeleteDialogComponent } from '../delete/groupe-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';

import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { AccountService } from '../../../core/auth/account.service';
import { EtudiantService } from '../../etudiant/service/etudiant.service';
import { IMatiere } from '../../matiere/matiere.model';
import { IEtudiant } from '../../etudiant/etudiant.model';

@Component({
  standalone: true,
  selector: 'jhi-groupe',
  templateUrl: './groupe.component.html',
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
export class GroupeComponent implements OnInit {
  constructor(
    protected groupeService: GroupeService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected accountService: AccountService,
    protected etudiantService: EtudiantService,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IGroupe): number => this.groupeService.getGroupeIdentifier(item);
  groupes?: IGroupe[];
  groupesetud?: IEtudiant[];
  isLoading = false;
  login!: String | undefined;
  idtest!: number;
  predicate = 'id';
  ascending = true;

  ngOnInit(): void {
    this.load();
    this.accountService.identity().subscribe(account => (this.login = account?.email));
    if (this.login !== undefined) {
      console.log('groupecomponent' + this.login);
      this.etudiantService.getIdEtudiantConnecte(this.login).subscribe(
        (id: number) => {
          this.idtest = id;
          this.etudiantService.getEtudiantsSameGroupe(this.idtest).subscribe((listegroupe: IEtudiant[]) => {
            this.groupesetud = listegroupe;
          });
          console.log('groupe' + this.idtest);
          this.load();
        },
        (error: any) => {
          console.error("Une erreur s'est produite :", error);
        }
      );
    } else {
      console.error("Erreur : L'adresse e-mail n'est pas définie.");
    }
    // this.matiereService.findByEnseignantId(this.idtest).subscribe((matieres: IMatiere[]) => {
    //   this.matieresenseignant = matieres;
    // });
  }

  delete(groupe: IGroupe): void {
    const modalRef = this.modalService.open(GroupeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.groupe = groupe;
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
    this.groupes = this.refineData(dataFromBody);
  }

  protected refineData(data: IGroupe[]): IGroupe[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IGroupe[] | null): IGroupe[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.groupeService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
