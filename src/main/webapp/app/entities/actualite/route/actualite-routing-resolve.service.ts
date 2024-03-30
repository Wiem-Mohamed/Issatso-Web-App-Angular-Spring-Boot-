import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActualite } from '../actualite.model';
import { ActualiteService } from '../service/actualite.service';

export const actualiteResolve = (route: ActivatedRouteSnapshot): Observable<null | IActualite> => {
  const id = route.params['id'];
  if (id) {
    return inject(ActualiteService)
      .find(id)
      .pipe(
        mergeMap((actualite: HttpResponse<IActualite>) => {
          if (actualite.body) {
            return of(actualite.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default actualiteResolve;
