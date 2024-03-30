import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActualiteComponent } from './list/actualite.component';
import { ActualiteDetailComponent } from './detail/actualite-detail.component';
import { ActualiteUpdateComponent } from './update/actualite-update.component';
import ActualiteResolve from './route/actualite-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const actualiteRoute: Routes = [
  {
    path: '',
    component: ActualiteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActualiteDetailComponent,
    resolve: {
      actualite: ActualiteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActualiteUpdateComponent,
    resolve: {
      actualite: ActualiteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActualiteUpdateComponent,
    resolve: {
      actualite: ActualiteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default actualiteRoute;
