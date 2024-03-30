import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDemandeEnseignant } from '../demande-enseignant.model';
import { DemandeEnseignantService } from '../service/demande-enseignant.service';

export const demandeEnseignantResolve = (route: ActivatedRouteSnapshot): Observable<null | IDemandeEnseignant> => {
  const id = route.params['id'];
  if (id) {
    return inject(DemandeEnseignantService)
      .find(id)
      .pipe(
        mergeMap((demandeEnseignant: HttpResponse<IDemandeEnseignant>) => {
          if (demandeEnseignant.body) {
            return of(demandeEnseignant.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default demandeEnseignantResolve;
