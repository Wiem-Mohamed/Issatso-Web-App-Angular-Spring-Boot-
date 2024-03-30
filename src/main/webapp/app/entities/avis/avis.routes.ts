import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AvisComponent } from './list/avis.component';
import { AvisDetailComponent } from './detail/avis-detail.component';
import { AvisUpdateComponent } from './update/avis-update.component';
import AvisResolve from './route/avis-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const avisRoute: Routes = [
  {
    path: '',
    component: AvisComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AvisDetailComponent,
    resolve: {
      avis: AvisResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AvisUpdateComponent,
    resolve: {
      avis: AvisResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AvisUpdateComponent,
    resolve: {
      avis: AvisResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default avisRoute;
