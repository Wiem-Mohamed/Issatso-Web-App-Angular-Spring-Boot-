import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EnseignantComponent } from './list/enseignant.component';
import { EnseignantDetailComponent } from './detail/enseignant-detail.component';
import { EnseignantUpdateComponent } from './update/enseignant-update.component';
import EnseignantResolve from './route/enseignant-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const enseignantRoute: Routes = [
  {
    path: '',
    component: EnseignantComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EnseignantDetailComponent,
    resolve: {
      enseignant: EnseignantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EnseignantUpdateComponent,
    resolve: {
      enseignant: EnseignantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EnseignantUpdateComponent,
    resolve: {
      enseignant: EnseignantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default enseignantRoute;
