import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISupportDeCours } from '../support-de-cours.model';
import { SupportDeCoursService } from '../service/support-de-cours.service';

export const supportDeCoursResolve = (route: ActivatedRouteSnapshot): Observable<null | ISupportDeCours> => {
  const id = route.params['id'];
  if (id) {
    return inject(SupportDeCoursService)
      .find(id)
      .pipe(
        mergeMap((supportDeCours: HttpResponse<ISupportDeCours>) => {
          if (supportDeCours.body) {
            return of(supportDeCours.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default supportDeCoursResolve;
