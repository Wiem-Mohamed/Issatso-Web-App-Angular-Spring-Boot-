import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MatiereDetailComponent } from './matiere-detail.component';

describe('Matiere Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatiereDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MatiereDetailComponent,
              resolve: { matiere: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(MatiereDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load matiere on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MatiereDetailComponent);

      // THEN
      expect(instance.matiere).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
