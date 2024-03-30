import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAvis } from '../avis.model';
import { AvisService } from '../service/avis.service';

export const avisResolve = (route: ActivatedRouteSnapshot): Observable<null | IAvis> => {
  const id = route.params['id'];
  if (id) {
    return inject(AvisService)
      .find(id)
      .pipe(
        mergeMap((avis: HttpResponse<IAvis>) => {
          if (avis.body) {
            return of(avis.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default avisResolve;
