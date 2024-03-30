import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDemandeEnseignant, NewDemandeEnseignant } from '../demande-enseignant.model';

export type PartialUpdateDemandeEnseignant = Partial<IDemandeEnseignant> & Pick<IDemandeEnseignant, 'id'>;

type RestOf<T extends IDemandeEnseignant | NewDemandeEnseignant> = Omit<T, 'dateCreation'> & {
  dateCreation?: string | null;
};

export type RestDemandeEnseignant = RestOf<IDemandeEnseignant>;

export type NewRestDemandeEnseignant = RestOf<NewDemandeEnseignant>;

export type PartialUpdateRestDemandeEnseignant = RestOf<PartialUpdateDemandeEnseignant>;

export type EntityResponseType = HttpResponse<IDemandeEnseignant>;
export type EntityArrayResponseType = HttpResponse<IDemandeEnseignant[]>;

@Injectable({ providedIn: 'root' })
export class DemandeEnseignantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/demande-enseignants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(demandeEnseignant: NewDemandeEnseignant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(demandeEnseignant);
    return this.http
      .post<RestDemandeEnseignant>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(demandeEnseignant: IDemandeEnseignant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(demandeEnseignant);
    return this.http
      .put<RestDemandeEnseignant>(`${this.resourceUrl}/${this.getDemandeEnseignantIdentifier(demandeEnseignant)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(demandeEnseignant: PartialUpdateDemandeEnseignant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(demandeEnseignant);
    return this.http
      .patch<RestDemandeEnseignant>(`${this.resourceUrl}/${this.getDemandeEnseignantIdentifier(demandeEnseignant)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDemandeEnseignant>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDemandeEnseignant[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDemandeEnseignantIdentifier(demandeEnseignant: Pick<IDemandeEnseignant, 'id'>): number {
    return demandeEnseignant.id;
  }

  compareDemandeEnseignant(o1: Pick<IDemandeEnseignant, 'id'> | null, o2: Pick<IDemandeEnseignant, 'id'> | null): boolean {
    return o1 && o2 ? this.getDemandeEnseignantIdentifier(o1) === this.getDemandeEnseignantIdentifier(o2) : o1 === o2;
  }

  addDemandeEnseignantToCollectionIfMissing<Type extends Pick<IDemandeEnseignant, 'id'>>(
    demandeEnseignantCollection: Type[],
    ...demandeEnseignantsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const demandeEnseignants: Type[] = demandeEnseignantsToCheck.filter(isPresent);
    if (demandeEnseignants.length > 0) {
      const demandeEnseignantCollectionIdentifiers = demandeEnseignantCollection.map(
        demandeEnseignantItem => this.getDemandeEnseignantIdentifier(demandeEnseignantItem)!
      );
      const demandeEnseignantsToAdd = demandeEnseignants.filter(demandeEnseignantItem => {
        const demandeEnseignantIdentifier = this.getDemandeEnseignantIdentifier(demandeEnseignantItem);
        if (demandeEnseignantCollectionIdentifiers.includes(demandeEnseignantIdentifier)) {
          return false;
        }
        demandeEnseignantCollectionIdentifiers.push(demandeEnseignantIdentifier);
        return true;
      });
      return [...demandeEnseignantsToAdd, ...demandeEnseignantCollection];
    }
    return demandeEnseignantCollection;
  }

  protected convertDateFromClient<T extends IDemandeEnseignant | NewDemandeEnseignant | PartialUpdateDemandeEnseignant>(
    demandeEnseignant: T
  ): RestOf<T> {
    return {
      ...demandeEnseignant,
      dateCreation: demandeEnseignant.dateCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDemandeEnseignant: RestDemandeEnseignant): IDemandeEnseignant {
    return {
      ...restDemandeEnseignant,
      dateCreation: restDemandeEnseignant.dateCreation ? dayjs(restDemandeEnseignant.dateCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDemandeEnseignant>): HttpResponse<IDemandeEnseignant> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDemandeEnseignant[]>): HttpResponse<IDemandeEnseignant[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
