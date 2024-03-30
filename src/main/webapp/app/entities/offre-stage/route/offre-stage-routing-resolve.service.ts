import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOffreStage } from '../offre-stage.model';
import { OffreStageService } from '../service/offre-stage.service';

export const offreStageResolve = (route: ActivatedRouteSnapshot): Observable<null | IOffreStage> => {
  const id = route.params['id'];
  if (id) {
    return inject(OffreStageService)
      .find(id)
      .pipe(
        mergeMap((offreStage: HttpResponse<IOffreStage>) => {
          if (offreStage.body) {
            return of(offreStage.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default offreStageResolve;
