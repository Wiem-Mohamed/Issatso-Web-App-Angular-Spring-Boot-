import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GroupeDetailComponent } from './groupe-detail.component';

describe('Groupe Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: GroupeDetailComponent,
              resolve: { groupe: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(GroupeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load groupe on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GroupeDetailComponent);

      // THEN
      expect(instance.groupe).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
