import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOffreStage, NewOffreStage } from '../offre-stage.model';

export type PartialUpdateOffreStage = Partial<IOffreStage> & Pick<IOffreStage, 'id'>;

type RestOf<T extends IOffreStage | NewOffreStage> = Omit<T, 'dateDebut' | 'dateFin'> & {
  dateDebut?: string | null;
  dateFin?: string | null;
};

export type RestOffreStage = RestOf<IOffreStage>;

export type NewRestOffreStage = RestOf<NewOffreStage>;

export type PartialUpdateRestOffreStage = RestOf<PartialUpdateOffreStage>;

export type EntityResponseType = HttpResponse<IOffreStage>;
export type EntityArrayResponseType = HttpResponse<IOffreStage[]>;

@Injectable({ providedIn: 'root' })
export class OffreStageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/offre-stages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(offreStage: NewOffreStage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(offreStage);
    return this.http
      .post<RestOffreStage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(offreStage: IOffreStage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(offreStage);
    return this.http
      .put<RestOffreStage>(`${this.resourceUrl}/${this.getOffreStageIdentifier(offreStage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(offreStage: PartialUpdateOffreStage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(offreStage);
    return this.http
      .patch<RestOffreStage>(`${this.resourceUrl}/${this.getOffreStageIdentifier(offreStage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOffreStage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOffreStage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOffreStageIdentifier(offreStage: Pick<IOffreStage, 'id'>): number {
    return offreStage.id;
  }

  compareOffreStage(o1: Pick<IOffreStage, 'id'> | null, o2: Pick<IOffreStage, 'id'> | null): boolean {
    return o1 && o2 ? this.getOffreStageIdentifier(o1) === this.getOffreStageIdentifier(o2) : o1 === o2;
  }

  addOffreStageToCollectionIfMissing<Type extends Pick<IOffreStage, 'id'>>(
    offreStageCollection: Type[],
    ...offreStagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const offreStages: Type[] = offreStagesToCheck.filter(isPresent);
    if (offreStages.length > 0) {
      const offreStageCollectionIdentifiers = offreStageCollection.map(offreStageItem => this.getOffreStageIdentifier(offreStageItem)!);
      const offreStagesToAdd = offreStages.filter(offreStageItem => {
        const offreStageIdentifier = this.getOffreStageIdentifier(offreStageItem);
        if (offreStageCollectionIdentifiers.includes(offreStageIdentifier)) {
          return false;
        }
        offreStageCollectionIdentifiers.push(offreStageIdentifier);
        return true;
      });
      return [...offreStagesToAdd, ...offreStageCollection];
    }
    return offreStageCollection;
  }

  protected convertDateFromClient<T extends IOffreStage | NewOffreStage | PartialUpdateOffreStage>(offreStage: T): RestOf<T> {
    return {
      ...offreStage,
      dateDebut: offreStage.dateDebut?.toJSON() ?? null,
      dateFin: offreStage.dateFin?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restOffreStage: RestOffreStage): IOffreStage {
    return {
      ...restOffreStage,
      dateDebut: restOffreStage.dateDebut ? dayjs(restOffreStage.dateDebut) : undefined,
      dateFin: restOffreStage.dateFin ? dayjs(restOffreStage.dateFin) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestOffreStage>): HttpResponse<IOffreStage> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOffreStage[]>): HttpResponse<IOffreStage[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
