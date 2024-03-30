import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ISupportDeCours } from '../support-de-cours.model';
import { SupportDeCoursService } from '../service/support-de-cours.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './support-de-cours-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SupportDeCoursDeleteDialogComponent {
  supportDeCours?: ISupportDeCours;

  constructor(protected supportDeCoursService: SupportDeCoursService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.supportDeCoursService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
