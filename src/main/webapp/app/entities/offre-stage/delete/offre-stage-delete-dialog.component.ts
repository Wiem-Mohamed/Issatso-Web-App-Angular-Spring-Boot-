import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IOffreStage } from '../offre-stage.model';
import { OffreStageService } from '../service/offre-stage.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './offre-stage-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class OffreStageDeleteDialogComponent {
  offreStage?: IOffreStage;

  constructor(protected offreStageService: OffreStageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.offreStageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
