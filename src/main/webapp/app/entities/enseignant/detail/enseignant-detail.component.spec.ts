import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EnseignantDetailComponent } from './enseignant-detail.component';

describe('Enseignant Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnseignantDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EnseignantDetailComponent,
              resolve: { enseignant: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(EnseignantDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load enseignant on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EnseignantDetailComponent);

      // THEN
      expect(instance.enseignant).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
