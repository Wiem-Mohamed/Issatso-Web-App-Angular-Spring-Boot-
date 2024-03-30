import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEnseignant } from '../enseignant.model';
import { EnseignantService } from '../service/enseignant.service';

export const enseignantResolve = (route: ActivatedRouteSnapshot): Observable<null | IEnseignant> => {
  const id = route.params['id'];
  if (id) {
    return inject(EnseignantService)
      .find(id)
      .pipe(
        mergeMap((enseignant: HttpResponse<IEnseignant>) => {
          if (enseignant.body) {
            return of(enseignant.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default enseignantResolve;
