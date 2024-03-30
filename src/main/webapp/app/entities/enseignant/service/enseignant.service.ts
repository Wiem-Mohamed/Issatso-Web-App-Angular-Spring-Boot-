import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEnseignant, NewEnseignant } from '../enseignant.model';

export type PartialUpdateEnseignant = Partial<IEnseignant> & Pick<IEnseignant, 'id'>;

type RestOf<T extends IEnseignant | NewEnseignant> = Omit<T, 'dateEmbauche'> & {
  dateEmbauche?: string | null;
};

export type RestEnseignant = RestOf<IEnseignant>;

export type NewRestEnseignant = RestOf<NewEnseignant>;

export type PartialUpdateRestEnseignant = RestOf<PartialUpdateEnseignant>;

export type EntityResponseType = HttpResponse<IEnseignant>;
export type EntityArrayResponseType = HttpResponse<IEnseignant[]>;

@Injectable({ providedIn: 'root' })
export class EnseignantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/enseignants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(enseignant: NewEnseignant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enseignant);
    return this.http
      .post<RestEnseignant>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(enseignant: IEnseignant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enseignant);
    return this.http
      .put<RestEnseignant>(`${this.resourceUrl}/${this.getEnseignantIdentifier(enseignant)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(enseignant: PartialUpdateEnseignant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enseignant);
    return this.http
      .patch<RestEnseignant>(`${this.resourceUrl}/${this.getEnseignantIdentifier(enseignant)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEnseignant>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEnseignant[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEnseignantIdentifier(enseignant: Pick<IEnseignant, 'id'>): number {
    return enseignant.id;
  }

  compareEnseignant(o1: Pick<IEnseignant, 'id'> | null, o2: Pick<IEnseignant, 'id'> | null): boolean {
    return o1 && o2 ? this.getEnseignantIdentifier(o1) === this.getEnseignantIdentifier(o2) : o1 === o2;
  }

  addEnseignantToCollectionIfMissing<Type extends Pick<IEnseignant, 'id'>>(
    enseignantCollection: Type[],
    ...enseignantsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const enseignants: Type[] = enseignantsToCheck.filter(isPresent);
    if (enseignants.length > 0) {
      const enseignantCollectionIdentifiers = enseignantCollection.map(enseignantItem => this.getEnseignantIdentifier(enseignantItem)!);
      const enseignantsToAdd = enseignants.filter(enseignantItem => {
        const enseignantIdentifier = this.getEnseignantIdentifier(enseignantItem);
        if (enseignantCollectionIdentifiers.includes(enseignantIdentifier)) {
          return false;
        }
        enseignantCollectionIdentifiers.push(enseignantIdentifier);
        return true;
      });
      return [...enseignantsToAdd, ...enseignantCollection];
    }
    return enseignantCollection;
  }

  protected convertDateFromClient<T extends IEnseignant | NewEnseignant | PartialUpdateEnseignant>(enseignant: T): RestOf<T> {
    return {
      ...enseignant,
      dateEmbauche: enseignant.dateEmbauche?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEnseignant: RestEnseignant): IEnseignant {
    return {
      ...restEnseignant,
      dateEmbauche: restEnseignant.dateEmbauche ? dayjs(restEnseignant.dateEmbauche) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEnseignant>): HttpResponse<IEnseignant> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEnseignant[]>): HttpResponse<IEnseignant[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
