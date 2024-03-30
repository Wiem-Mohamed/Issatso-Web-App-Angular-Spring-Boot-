import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEvenement } from '../evenement.model';
import { EvenementService } from '../service/evenement.service';

export const evenementResolve = (route: ActivatedRouteSnapshot): Observable<null | IEvenement> => {
  const id = route.params['id'];
  if (id) {
    return inject(EvenementService)
      .find(id)
      .pipe(
        mergeMap((evenement: HttpResponse<IEvenement>) => {
          if (evenement.body) {
            return of(evenement.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default evenementResolve;
