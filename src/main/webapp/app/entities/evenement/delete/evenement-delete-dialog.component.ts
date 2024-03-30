import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IEvenement } from '../evenement.model';
import { EvenementService } from '../service/evenement.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './evenement-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EvenementDeleteDialogComponent {
  evenement?: IEvenement;

  constructor(protected evenementService: EvenementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.evenementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
