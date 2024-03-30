import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IPartenaire } from '../partenaire.model';
import { PartenaireService } from '../service/partenaire.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './partenaire-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PartenaireDeleteDialogComponent {
  partenaire?: IPartenaire;

  constructor(protected partenaireService: PartenaireService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.partenaireService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
