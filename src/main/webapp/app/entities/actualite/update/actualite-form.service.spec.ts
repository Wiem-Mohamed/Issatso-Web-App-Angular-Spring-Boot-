import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../actualite.test-samples';

import { ActualiteFormService } from './actualite-form.service';

describe('Actualite Form Service', () => {
  let service: ActualiteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActualiteFormService);
  });

  describe('Service methods', () => {
    describe('createActualiteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createActualiteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titre: expect.any(Object),
            image: expect.any(Object),
            contenu: expect.any(Object),
            datePublication: expect.any(Object),
          })
        );
      });

      it('passing IActualite should create a new form with FormGroup', () => {
        const formGroup = service.createActualiteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titre: expect.any(Object),
            image: expect.any(Object),
            contenu: expect.any(Object),
            datePublication: expect.any(Object),
          })
        );
      });
    });

    describe('getActualite', () => {
      it('should return NewActualite for default Actualite initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createActualiteFormGroup(sampleWithNewData);

        const actualite = service.getActualite(formGroup) as any;

        expect(actualite).toMatchObject(sampleWithNewData);
      });

      it('should return NewActualite for empty Actualite initial value', () => {
        const formGroup = service.createActualiteFormGroup();

        const actualite = service.getActualite(formGroup) as any;

        expect(actualite).toMatchObject({});
      });

      it('should return IActualite', () => {
        const formGroup = service.createActualiteFormGroup(sampleWithRequiredData);

        const actualite = service.getActualite(formGroup) as any;

        expect(actualite).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IActualite should not enable id FormControl', () => {
        const formGroup = service.createActualiteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewActualite should disable id FormControl', () => {
        const formGroup = service.createActualiteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
