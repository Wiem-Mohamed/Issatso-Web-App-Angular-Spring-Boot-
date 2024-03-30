import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'actualite',
        data: { pageTitle: 'issatsoApp.actualite.home.title' },
        loadChildren: () => import('./actualite/actualite.routes'),
      },
      {
        path: 'avis',
        data: { pageTitle: 'issatsoApp.avis.home.title' },
        loadChildren: () => import('./avis/avis.routes'),
      },
      {
        path: 'demande-enseignant',
        data: { pageTitle: 'issatsoApp.demandeEnseignant.home.title' },
        loadChildren: () => import('./demande-enseignant/demande-enseignant.routes'),
      },
      {
        path: 'demande-etudiant',
        data: { pageTitle: 'issatsoApp.demandeEtudiant.home.title' },
        loadChildren: () => import('./demande-etudiant/demande-etudiant.routes'),
      },
      {
        path: 'departement',
        data: { pageTitle: 'issatsoApp.departement.home.title' },
        loadChildren: () => import('./departement/departement.routes'),
      },
      {
        path: 'enseignant',
        data: { pageTitle: 'issatsoApp.enseignant.home.title' },
        loadChildren: () => import('./enseignant/enseignant.routes'),
      },
      {
        path: 'etudiant',
        data: { pageTitle: 'issatsoApp.etudiant.home.title' },
        loadChildren: () => import('./etudiant/etudiant.routes'),
      },
      {
        path: 'evenement',
        data: { pageTitle: 'issatsoApp.evenement.home.title' },
        loadChildren: () => import('./evenement/evenement.routes'),
      },
      {
        path: 'groupe',
        data: { pageTitle: 'issatsoApp.groupe.home.title' },
        loadChildren: () => import('./groupe/groupe.routes'),
      },
      {
        path: 'matiere',
        data: { pageTitle: 'issatsoApp.matiere.home.title' },
        loadChildren: () => import('./matiere/matiere.routes'),
      },
      {
        path: 'offre-stage',
        data: { pageTitle: 'issatsoApp.offreStage.home.title' },
        loadChildren: () => import('./offre-stage/offre-stage.routes'),
      },
      {
        path: 'partenaire',
        data: { pageTitle: 'issatsoApp.partenaire.home.title' },
        loadChildren: () => import('./partenaire/partenaire.routes'),
      },
      {
        path: 'support-de-cours',
        data: { pageTitle: 'issatsoApp.supportDeCours.home.title' },
        loadChildren: () => import('./support-de-cours/support-de-cours.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
