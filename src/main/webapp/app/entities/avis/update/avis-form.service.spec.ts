import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../avis.test-samples';

import { AvisFormService } from './avis-form.service';

describe('Avis Form Service', () => {
  let service: AvisFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvisFormService);
  });

  describe('Service methods', () => {
    describe('createAvisFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAvisFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sujet: expect.any(Object),
            description: expect.any(Object),
            dateCreation: expect.any(Object),
          })
        );
      });

      it('passing IAvis should create a new form with FormGroup', () => {
        const formGroup = service.createAvisFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sujet: expect.any(Object),
            description: expect.any(Object),
            dateCreation: expect.any(Object),
          })
        );
      });
    });

    describe('getAvis', () => {
      it('should return NewAvis for default Avis initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAvisFormGroup(sampleWithNewData);

        const avis = service.getAvis(formGroup) as any;

        expect(avis).toMatchObject(sampleWithNewData);
      });

      it('should return NewAvis for empty Avis initial value', () => {
        const formGroup = service.createAvisFormGroup();

        const avis = service.getAvis(formGroup) as any;

        expect(avis).toMatchObject({});
      });

      it('should return IAvis', () => {
        const formGroup = service.createAvisFormGroup(sampleWithRequiredData);

        const avis = service.getAvis(formGroup) as any;

        expect(avis).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAvis should not enable id FormControl', () => {
        const formGroup = service.createAvisFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAvis should disable id FormControl', () => {
        const formGroup = service.createAvisFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
