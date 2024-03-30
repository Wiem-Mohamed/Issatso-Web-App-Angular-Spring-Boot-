import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGroupe, NewGroupe } from '../groupe.model';

export type PartialUpdateGroupe = Partial<IGroupe> & Pick<IGroupe, 'id'>;

export type EntityResponseType = HttpResponse<IGroupe>;
export type EntityArrayResponseType = HttpResponse<IGroupe[]>;

@Injectable({ providedIn: 'root' })
export class GroupeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/groupes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(groupe: NewGroupe): Observable<EntityResponseType> {
    return this.http.post<IGroupe>(this.resourceUrl, groupe, { observe: 'response' });
  }

  update(groupe: IGroupe): Observable<EntityResponseType> {
    return this.http.put<IGroupe>(`${this.resourceUrl}/${this.getGroupeIdentifier(groupe)}`, groupe, { observe: 'response' });
  }

  partialUpdate(groupe: PartialUpdateGroupe): Observable<EntityResponseType> {
    return this.http.patch<IGroupe>(`${this.resourceUrl}/${this.getGroupeIdentifier(groupe)}`, groupe, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGroupe>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGroupe[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGroupeIdentifier(groupe: Pick<IGroupe, 'id'>): number {
    return groupe.id;
  }

  compareGroupe(o1: Pick<IGroupe, 'id'> | null, o2: Pick<IGroupe, 'id'> | null): boolean {
    return o1 && o2 ? this.getGroupeIdentifier(o1) === this.getGroupeIdentifier(o2) : o1 === o2;
  }

  addGroupeToCollectionIfMissing<Type extends Pick<IGroupe, 'id'>>(
    groupeCollection: Type[],
    ...groupesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const groupes: Type[] = groupesToCheck.filter(isPresent);
    if (groupes.length > 0) {
      const groupeCollectionIdentifiers = groupeCollection.map(groupeItem => this.getGroupeIdentifier(groupeItem)!);
      const groupesToAdd = groupes.filter(groupeItem => {
        const groupeIdentifier = this.getGroupeIdentifier(groupeItem);
        if (groupeCollectionIdentifiers.includes(groupeIdentifier)) {
          return false;
        }
        groupeCollectionIdentifiers.push(groupeIdentifier);
        return true;
      });
      return [...groupesToAdd, ...groupeCollection];
    }
    return groupeCollection;
  }
}
