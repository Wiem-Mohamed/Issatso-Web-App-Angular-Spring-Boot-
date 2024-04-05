import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IDemandeEnseignant } from '../demande-enseignant.model';
import { DataUtils } from 'app/core/util/data-util.service';

import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';

@Component({
  standalone: true,
  selector: 'jhi-demande-enseignant-detail',
  templateUrl: './demande-enseignant-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, HasAnyAuthorityDirective],
})
export class DemandeEnseignantDetailComponent {
  @Input() demandeEnseignant: IDemandeEnseignant | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
