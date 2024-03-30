import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DemandeEtudiantComponent } from './list/demande-etudiant.component';
import { DemandeEtudiantDetailComponent } from './detail/demande-etudiant-detail.component';
import { DemandeEtudiantUpdateComponent } from './update/demande-etudiant-update.component';
import DemandeEtudiantResolve from './route/demande-etudiant-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const demandeEtudiantRoute: Routes = [
  {
    path: '',
    component: DemandeEtudiantComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DemandeEtudiantDetailComponent,
    resolve: {
      demandeEtudiant: DemandeEtudiantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DemandeEtudiantUpdateComponent,
    resolve: {
      demandeEtudiant: DemandeEtudiantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DemandeEtudiantUpdateComponent,
    resolve: {
      demandeEtudiant: DemandeEtudiantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default demandeEtudiantRoute;
