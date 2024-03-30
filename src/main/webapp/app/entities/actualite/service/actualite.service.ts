import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActualite, NewActualite } from '../actualite.model';

export type PartialUpdateActualite = Partial<IActualite> & Pick<IActualite, 'id'>;

type RestOf<T extends IActualite | NewActualite> = Omit<T, 'datePublication'> & {
  datePublication?: string | null;
};

export type RestActualite = RestOf<IActualite>;

export type NewRestActualite = RestOf<NewActualite>;

export type PartialUpdateRestActualite = RestOf<PartialUpdateActualite>;

export type EntityResponseType = HttpResponse<IActualite>;
export type EntityArrayResponseType = HttpResponse<IActualite[]>;

@Injectable({ providedIn: 'root' })
export class ActualiteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/actualites');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(actualite: NewActualite): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(actualite);
    return this.http
      .post<RestActualite>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(actualite: IActualite): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(actualite);
    return this.http
      .put<RestActualite>(`${this.resourceUrl}/${this.getActualiteIdentifier(actualite)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(actualite: PartialUpdateActualite): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(actualite);
    return this.http
      .patch<RestActualite>(`${this.resourceUrl}/${this.getActualiteIdentifier(actualite)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestActualite>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestActualite[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActualiteIdentifier(actualite: Pick<IActualite, 'id'>): number {
    return actualite.id;
  }

  compareActualite(o1: Pick<IActualite, 'id'> | null, o2: Pick<IActualite, 'id'> | null): boolean {
    return o1 && o2 ? this.getActualiteIdentifier(o1) === this.getActualiteIdentifier(o2) : o1 === o2;
  }

  addActualiteToCollectionIfMissing<Type extends Pick<IActualite, 'id'>>(
    actualiteCollection: Type[],
    ...actualitesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const actualites: Type[] = actualitesToCheck.filter(isPresent);
    if (actualites.length > 0) {
      const actualiteCollectionIdentifiers = actualiteCollection.map(actualiteItem => this.getActualiteIdentifier(actualiteItem)!);
      const actualitesToAdd = actualites.filter(actualiteItem => {
        const actualiteIdentifier = this.getActualiteIdentifier(actualiteItem);
        if (actualiteCollectionIdentifiers.includes(actualiteIdentifier)) {
          return false;
        }
        actualiteCollectionIdentifiers.push(actualiteIdentifier);
        return true;
      });
      return [...actualitesToAdd, ...actualiteCollection];
    }
    return actualiteCollection;
  }

  protected convertDateFromClient<T extends IActualite | NewActualite | PartialUpdateActualite>(actualite: T): RestOf<T> {
    return {
      ...actualite,
      datePublication: actualite.datePublication?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restActualite: RestActualite): IActualite {
    return {
      ...restActualite,
      datePublication: restActualite.datePublication ? dayjs(restActualite.datePublication) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestActualite>): HttpResponse<IActualite> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestActualite[]>): HttpResponse<IActualite[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
