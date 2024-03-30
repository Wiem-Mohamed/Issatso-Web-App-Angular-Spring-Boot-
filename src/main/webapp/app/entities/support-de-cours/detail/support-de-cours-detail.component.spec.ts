import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SupportDeCoursDetailComponent } from './support-de-cours-detail.component';

describe('SupportDeCours Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportDeCoursDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SupportDeCoursDetailComponent,
              resolve: { supportDeCours: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(SupportDeCoursDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load supportDeCours on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SupportDeCoursDetailComponent);

      // THEN
      expect(instance.supportDeCours).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
