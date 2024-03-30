import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAvis, NewAvis } from '../avis.model';

export type PartialUpdateAvis = Partial<IAvis> & Pick<IAvis, 'id'>;

type RestOf<T extends IAvis | NewAvis> = Omit<T, 'dateCreation'> & {
  dateCreation?: string | null;
};

export type RestAvis = RestOf<IAvis>;

export type NewRestAvis = RestOf<NewAvis>;

export type PartialUpdateRestAvis = RestOf<PartialUpdateAvis>;

export type EntityResponseType = HttpResponse<IAvis>;
export type EntityArrayResponseType = HttpResponse<IAvis[]>;

@Injectable({ providedIn: 'root' })
export class AvisService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/avis');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(avis: NewAvis): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(avis);
    return this.http.post<RestAvis>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(avis: IAvis): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(avis);
    return this.http
      .put<RestAvis>(`${this.resourceUrl}/${this.getAvisIdentifier(avis)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(avis: PartialUpdateAvis): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(avis);
    return this.http
      .patch<RestAvis>(`${this.resourceUrl}/${this.getAvisIdentifier(avis)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAvis>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAvis[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAvisIdentifier(avis: Pick<IAvis, 'id'>): number {
    return avis.id;
  }

  compareAvis(o1: Pick<IAvis, 'id'> | null, o2: Pick<IAvis, 'id'> | null): boolean {
    return o1 && o2 ? this.getAvisIdentifier(o1) === this.getAvisIdentifier(o2) : o1 === o2;
  }

  addAvisToCollectionIfMissing<Type extends Pick<IAvis, 'id'>>(
    avisCollection: Type[],
    ...avisToCheck: (Type | null | undefined)[]
  ): Type[] {
    const avis: Type[] = avisToCheck.filter(isPresent);
    if (avis.length > 0) {
      const avisCollectionIdentifiers = avisCollection.map(avisItem => this.getAvisIdentifier(avisItem)!);
      const avisToAdd = avis.filter(avisItem => {
        const avisIdentifier = this.getAvisIdentifier(avisItem);
        if (avisCollectionIdentifiers.includes(avisIdentifier)) {
          return false;
        }
        avisCollectionIdentifiers.push(avisIdentifier);
        return true;
      });
      return [...avisToAdd, ...avisCollection];
    }
    return avisCollection;
  }

  protected convertDateFromClient<T extends IAvis | NewAvis | PartialUpdateAvis>(avis: T): RestOf<T> {
    return {
      ...avis,
      dateCreation: avis.dateCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAvis: RestAvis): IAvis {
    return {
      ...restAvis,
      dateCreation: restAvis.dateCreation ? dayjs(restAvis.dateCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAvis>): HttpResponse<IAvis> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAvis[]>): HttpResponse<IAvis[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
