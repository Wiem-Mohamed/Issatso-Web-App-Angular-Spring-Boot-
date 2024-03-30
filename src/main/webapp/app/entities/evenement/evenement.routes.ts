import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EvenementComponent } from './list/evenement.component';
import { EvenementDetailComponent } from './detail/evenement-detail.component';
import { EvenementUpdateComponent } from './update/evenement-update.component';
import EvenementResolve from './route/evenement-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const evenementRoute: Routes = [
  {
    path: '',
    component: EvenementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EvenementDetailComponent,
    resolve: {
      evenement: EvenementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EvenementUpdateComponent,
    resolve: {
      evenement: EvenementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EvenementUpdateComponent,
    resolve: {
      evenement: EvenementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default evenementRoute;
