import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IDemandeEnseignant } from '../demande-enseignant.model';
import { DemandeEnseignantService } from '../service/demande-enseignant.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './demande-enseignant-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class DemandeEnseignantDeleteDialogComponent {
  demandeEnseignant?: IDemandeEnseignant;

  constructor(protected demandeEnseignantService: DemandeEnseignantService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.demandeEnseignantService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
