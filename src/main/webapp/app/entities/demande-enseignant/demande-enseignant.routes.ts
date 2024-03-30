import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DemandeEnseignantComponent } from './list/demande-enseignant.component';
import { DemandeEnseignantDetailComponent } from './detail/demande-enseignant-detail.component';
import { DemandeEnseignantUpdateComponent } from './update/demande-enseignant-update.component';
import DemandeEnseignantResolve from './route/demande-enseignant-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const demandeEnseignantRoute: Routes = [
  {
    path: '',
    component: DemandeEnseignantComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DemandeEnseignantDetailComponent,
    resolve: {
      demandeEnseignant: DemandeEnseignantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DemandeEnseignantUpdateComponent,
    resolve: {
      demandeEnseignant: DemandeEnseignantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DemandeEnseignantUpdateComponent,
    resolve: {
      demandeEnseignant: DemandeEnseignantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default demandeEnseignantRoute;
