import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OffreStageComponent } from './list/offre-stage.component';
import { OffreStageDetailComponent } from './detail/offre-stage-detail.component';
import { OffreStageUpdateComponent } from './update/offre-stage-update.component';
import OffreStageResolve from './route/offre-stage-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const offreStageRoute: Routes = [
  {
    path: '',
    component: OffreStageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OffreStageDetailComponent,
    resolve: {
      offreStage: OffreStageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OffreStageUpdateComponent,
    resolve: {
      offreStage: OffreStageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OffreStageUpdateComponent,
    resolve: {
      offreStage: OffreStageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default offreStageRoute;
