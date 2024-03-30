import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDemandeEtudiant } from '../demande-etudiant.model';
import { DemandeEtudiantService } from '../service/demande-etudiant.service';

export const demandeEtudiantResolve = (route: ActivatedRouteSnapshot): Observable<null | IDemandeEtudiant> => {
  const id = route.params['id'];
  if (id) {
    return inject(DemandeEtudiantService)
      .find(id)
      .pipe(
        mergeMap((demandeEtudiant: HttpResponse<IDemandeEtudiant>) => {
          if (demandeEtudiant.body) {
            return of(demandeEtudiant.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default demandeEtudiantResolve;
