import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IDemandeEtudiant } from '../demande-etudiant.model';
import { DemandeEtudiantService } from '../service/demande-etudiant.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './demande-etudiant-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class DemandeEtudiantDeleteDialogComponent {
  demandeEtudiant?: IDemandeEtudiant;

  constructor(protected demandeEtudiantService: DemandeEtudiantService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.demandeEtudiantService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
