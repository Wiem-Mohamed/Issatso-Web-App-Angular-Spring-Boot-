import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SupportDeCoursComponent } from './list/support-de-cours.component';
import { SupportDeCoursDetailComponent } from './detail/support-de-cours-detail.component';
import { SupportDeCoursUpdateComponent } from './update/support-de-cours-update.component';
import SupportDeCoursResolve from './route/support-de-cours-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';
import { CoursetudiantComponent } from './coursetudiant/coursetudiant.component';

const supportDeCoursRoute: Routes = [
  {
    path: '',
    component: SupportDeCoursComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SupportDeCoursDetailComponent,
    resolve: {
      supportDeCours: SupportDeCoursResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SupportDeCoursUpdateComponent,
    resolve: {
      supportDeCours: SupportDeCoursResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'coursetudiant',
    component: CoursetudiantComponent,
    resolve: {
      supportDeCours: SupportDeCoursResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SupportDeCoursUpdateComponent,
    resolve: {
      supportDeCours: SupportDeCoursResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default supportDeCoursRoute;
