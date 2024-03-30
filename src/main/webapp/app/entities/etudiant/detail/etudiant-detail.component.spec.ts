import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EtudiantDetailComponent } from './etudiant-detail.component';

describe('Etudiant Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtudiantDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EtudiantDetailComponent,
              resolve: { etudiant: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(EtudiantDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load etudiant on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EtudiantDetailComponent);

      // THEN
      expect(instance.etudiant).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
