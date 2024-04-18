import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISupportDeCours, NewSupportDeCours } from '../support-de-cours.model';
import { IMatiere } from '../../matiere/matiere.model';

export type PartialUpdateSupportDeCours = Partial<ISupportDeCours> & Pick<ISupportDeCours, 'id'>;

type RestOf<T extends ISupportDeCours | NewSupportDeCours> = Omit<T, 'dateDepot'> & {
  dateDepot?: string | null;
};

export type RestSupportDeCours = RestOf<ISupportDeCours>;

export type NewRestSupportDeCours = RestOf<NewSupportDeCours>;

export type PartialUpdateRestSupportDeCours = RestOf<PartialUpdateSupportDeCours>;

export type EntityResponseType = HttpResponse<ISupportDeCours>;
export type EntityArrayResponseType = HttpResponse<ISupportDeCours[]>;

@Injectable({ providedIn: 'root' })
export class SupportDeCoursService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/support-de-cours');
  protected resourceUrl2 = this.applicationConfigService.getEndpointFor('api/matieres');
  protected resourceUrl3 = this.applicationConfigService.getEndpointFor('api/mail');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(supportDeCours: NewSupportDeCours): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(supportDeCours);
    return this.http
      .post<RestSupportDeCours>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(supportDeCours: ISupportDeCours): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(supportDeCours);
    return this.http
      .put<RestSupportDeCours>(`${this.resourceUrl}/${this.getSupportDeCoursIdentifier(supportDeCours)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(supportDeCours: PartialUpdateSupportDeCours): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(supportDeCours);
    return this.http
      .patch<RestSupportDeCours>(`${this.resourceUrl}/${this.getSupportDeCoursIdentifier(supportDeCours)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSupportDeCours>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSupportDeCours[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSupportDeCoursIdentifier(supportDeCours: Pick<ISupportDeCours, 'id'>): number {
    return supportDeCours.id;
  }

  compareSupportDeCours(o1: Pick<ISupportDeCours, 'id'> | null, o2: Pick<ISupportDeCours, 'id'> | null): boolean {
    return o1 && o2 ? this.getSupportDeCoursIdentifier(o1) === this.getSupportDeCoursIdentifier(o2) : o1 === o2;
  }

  addSupportDeCoursToCollectionIfMissing<Type extends Pick<ISupportDeCours, 'id'>>(
    supportDeCoursCollection: Type[],
    ...supportDeCoursToCheck: (Type | null | undefined)[]
  ): Type[] {
    const supportDeCours: Type[] = supportDeCoursToCheck.filter(isPresent);
    if (supportDeCours.length > 0) {
      const supportDeCoursCollectionIdentifiers = supportDeCoursCollection.map(
        supportDeCoursItem => this.getSupportDeCoursIdentifier(supportDeCoursItem)!
      );
      const supportDeCoursToAdd = supportDeCours.filter(supportDeCoursItem => {
        const supportDeCoursIdentifier = this.getSupportDeCoursIdentifier(supportDeCoursItem);
        if (supportDeCoursCollectionIdentifiers.includes(supportDeCoursIdentifier)) {
          return false;
        }
        supportDeCoursCollectionIdentifiers.push(supportDeCoursIdentifier);
        return true;
      });
      return [...supportDeCoursToAdd, ...supportDeCoursCollection];
    }
    return supportDeCoursCollection;
  }

  protected convertDateFromClient<T extends ISupportDeCours | NewSupportDeCours | PartialUpdateSupportDeCours>(
    supportDeCours: T
  ): RestOf<T> {
    return {
      ...supportDeCours,
      dateDepot: supportDeCours.dateDepot?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSupportDeCours: RestSupportDeCours): ISupportDeCours {
    return {
      ...restSupportDeCours,
      dateDepot: restSupportDeCours.dateDepot ? dayjs(restSupportDeCours.dateDepot) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSupportDeCours>): HttpResponse<ISupportDeCours> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSupportDeCours[]>): HttpResponse<ISupportDeCours[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
  findByEnseignantId(enseignantId: number): Observable<IMatiere[]> {
    return this.http.get<IMatiere[]>(`${this.resourceUrl2}/by-enseignant/${enseignantId}`).pipe(
      map((response: IMatiere[]) => response) // Utilisation de l'opérateur map pour extraire les données du corps de la réponse
    );
  }

  getIdEnseigantConnecte(mail: String): Observable<number> {
    return this.http.get<number>(`${this.resourceUrl3}/${mail}`).pipe(
      map((id: number) => {
        return id;
      })
    );
  }
}
