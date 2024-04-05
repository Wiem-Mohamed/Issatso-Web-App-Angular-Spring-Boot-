import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IDepartement } from '../departement.model';

import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';

@Component({
  standalone: true,
  selector: 'jhi-departement-detail',
  templateUrl: './departement-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, HasAnyAuthorityDirective],
})
export class DepartementDetailComponent {
  @Input() departement: IDepartement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
