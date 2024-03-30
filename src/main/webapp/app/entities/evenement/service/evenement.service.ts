import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEvenement, NewEvenement } from '../evenement.model';

export type PartialUpdateEvenement = Partial<IEvenement> & Pick<IEvenement, 'id'>;

type RestOf<T extends IEvenement | NewEvenement> = Omit<T, 'dateDebut' | 'dateFin'> & {
  dateDebut?: string | null;
  dateFin?: string | null;
};

export type RestEvenement = RestOf<IEvenement>;

export type NewRestEvenement = RestOf<NewEvenement>;

export type PartialUpdateRestEvenement = RestOf<PartialUpdateEvenement>;

export type EntityResponseType = HttpResponse<IEvenement>;
export type EntityArrayResponseType = HttpResponse<IEvenement[]>;

@Injectable({ providedIn: 'root' })
export class EvenementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/evenements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(evenement: NewEvenement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(evenement);
    return this.http
      .post<RestEvenement>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(evenement: IEvenement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(evenement);
    return this.http
      .put<RestEvenement>(`${this.resourceUrl}/${this.getEvenementIdentifier(evenement)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(evenement: PartialUpdateEvenement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(evenement);
    return this.http
      .patch<RestEvenement>(`${this.resourceUrl}/${this.getEvenementIdentifier(evenement)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEvenement>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEvenement[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEvenementIdentifier(evenement: Pick<IEvenement, 'id'>): number {
    return evenement.id;
  }

  compareEvenement(o1: Pick<IEvenement, 'id'> | null, o2: Pick<IEvenement, 'id'> | null): boolean {
    return o1 && o2 ? this.getEvenementIdentifier(o1) === this.getEvenementIdentifier(o2) : o1 === o2;
  }

  addEvenementToCollectionIfMissing<Type extends Pick<IEvenement, 'id'>>(
    evenementCollection: Type[],
    ...evenementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const evenements: Type[] = evenementsToCheck.filter(isPresent);
    if (evenements.length > 0) {
      const evenementCollectionIdentifiers = evenementCollection.map(evenementItem => this.getEvenementIdentifier(evenementItem)!);
      const evenementsToAdd = evenements.filter(evenementItem => {
        const evenementIdentifier = this.getEvenementIdentifier(evenementItem);
        if (evenementCollectionIdentifiers.includes(evenementIdentifier)) {
          return false;
        }
        evenementCollectionIdentifiers.push(evenementIdentifier);
        return true;
      });
      return [...evenementsToAdd, ...evenementCollection];
    }
    return evenementCollection;
  }

  protected convertDateFromClient<T extends IEvenement | NewEvenement | PartialUpdateEvenement>(evenement: T): RestOf<T> {
    return {
      ...evenement,
      dateDebut: evenement.dateDebut?.toJSON() ?? null,
      dateFin: evenement.dateFin?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEvenement: RestEvenement): IEvenement {
    return {
      ...restEvenement,
      dateDebut: restEvenement.dateDebut ? dayjs(restEvenement.dateDebut) : undefined,
      dateFin: restEvenement.dateFin ? dayjs(restEvenement.dateFin) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEvenement>): HttpResponse<IEvenement> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEvenement[]>): HttpResponse<IEvenement[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
