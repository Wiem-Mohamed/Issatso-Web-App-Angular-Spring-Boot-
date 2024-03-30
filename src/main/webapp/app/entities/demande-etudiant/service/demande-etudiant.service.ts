import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDemandeEtudiant, NewDemandeEtudiant } from '../demande-etudiant.model';

export type PartialUpdateDemandeEtudiant = Partial<IDemandeEtudiant> & Pick<IDemandeEtudiant, 'id'>;

type RestOf<T extends IDemandeEtudiant | NewDemandeEtudiant> = Omit<T, 'dateCreation'> & {
  dateCreation?: string | null;
};

export type RestDemandeEtudiant = RestOf<IDemandeEtudiant>;

export type NewRestDemandeEtudiant = RestOf<NewDemandeEtudiant>;

export type PartialUpdateRestDemandeEtudiant = RestOf<PartialUpdateDemandeEtudiant>;

export type EntityResponseType = HttpResponse<IDemandeEtudiant>;
export type EntityArrayResponseType = HttpResponse<IDemandeEtudiant[]>;

@Injectable({ providedIn: 'root' })
export class DemandeEtudiantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/demande-etudiants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(demandeEtudiant: NewDemandeEtudiant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(demandeEtudiant);
    return this.http
      .post<RestDemandeEtudiant>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(demandeEtudiant: IDemandeEtudiant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(demandeEtudiant);
    return this.http
      .put<RestDemandeEtudiant>(`${this.resourceUrl}/${this.getDemandeEtudiantIdentifier(demandeEtudiant)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(demandeEtudiant: PartialUpdateDemandeEtudiant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(demandeEtudiant);
    return this.http
      .patch<RestDemandeEtudiant>(`${this.resourceUrl}/${this.getDemandeEtudiantIdentifier(demandeEtudiant)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDemandeEtudiant>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDemandeEtudiant[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDemandeEtudiantIdentifier(demandeEtudiant: Pick<IDemandeEtudiant, 'id'>): number {
    return demandeEtudiant.id;
  }

  compareDemandeEtudiant(o1: Pick<IDemandeEtudiant, 'id'> | null, o2: Pick<IDemandeEtudiant, 'id'> | null): boolean {
    return o1 && o2 ? this.getDemandeEtudiantIdentifier(o1) === this.getDemandeEtudiantIdentifier(o2) : o1 === o2;
  }

  addDemandeEtudiantToCollectionIfMissing<Type extends Pick<IDemandeEtudiant, 'id'>>(
    demandeEtudiantCollection: Type[],
    ...demandeEtudiantsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const demandeEtudiants: Type[] = demandeEtudiantsToCheck.filter(isPresent);
    if (demandeEtudiants.length > 0) {
      const demandeEtudiantCollectionIdentifiers = demandeEtudiantCollection.map(
        demandeEtudiantItem => this.getDemandeEtudiantIdentifier(demandeEtudiantItem)!
      );
      const demandeEtudiantsToAdd = demandeEtudiants.filter(demandeEtudiantItem => {
        const demandeEtudiantIdentifier = this.getDemandeEtudiantIdentifier(demandeEtudiantItem);
        if (demandeEtudiantCollectionIdentifiers.includes(demandeEtudiantIdentifier)) {
          return false;
        }
        demandeEtudiantCollectionIdentifiers.push(demandeEtudiantIdentifier);
        return true;
      });
      return [...demandeEtudiantsToAdd, ...demandeEtudiantCollection];
    }
    return demandeEtudiantCollection;
  }

  protected convertDateFromClient<T extends IDemandeEtudiant | NewDemandeEtudiant | PartialUpdateDemandeEtudiant>(
    demandeEtudiant: T
  ): RestOf<T> {
    return {
      ...demandeEtudiant,
      dateCreation: demandeEtudiant.dateCreation?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDemandeEtudiant: RestDemandeEtudiant): IDemandeEtudiant {
    return {
      ...restDemandeEtudiant,
      dateCreation: restDemandeEtudiant.dateCreation ? dayjs(restDemandeEtudiant.dateCreation) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDemandeEtudiant>): HttpResponse<IDemandeEtudiant> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDemandeEtudiant[]>): HttpResponse<IDemandeEtudiant[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
