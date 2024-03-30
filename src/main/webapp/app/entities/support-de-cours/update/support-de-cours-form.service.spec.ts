import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../support-de-cours.test-samples';

import { SupportDeCoursFormService } from './support-de-cours-form.service';

describe('SupportDeCours Form Service', () => {
  let service: SupportDeCoursFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportDeCoursFormService);
  });

  describe('Service methods', () => {
    describe('createSupportDeCoursFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSupportDeCoursFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titre: expect.any(Object),
            description: expect.any(Object),
            contenu: expect.any(Object),
            dateDepot: expect.any(Object),
            nomMatiere: expect.any(Object),
          })
        );
      });

      it('passing ISupportDeCours should create a new form with FormGroup', () => {
        const formGroup = service.createSupportDeCoursFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titre: expect.any(Object),
            description: expect.any(Object),
            contenu: expect.any(Object),
            dateDepot: expect.any(Object),
            nomMatiere: expect.any(Object),
          })
        );
      });
    });

    describe('getSupportDeCours', () => {
      it('should return NewSupportDeCours for default SupportDeCours initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSupportDeCoursFormGroup(sampleWithNewData);

        const supportDeCours = service.getSupportDeCours(formGroup) as any;

        expect(supportDeCours).toMatchObject(sampleWithNewData);
      });

      it('should return NewSupportDeCours for empty SupportDeCours initial value', () => {
        const formGroup = service.createSupportDeCoursFormGroup();

        const supportDeCours = service.getSupportDeCours(formGroup) as any;

        expect(supportDeCours).toMatchObject({});
      });

      it('should return ISupportDeCours', () => {
        const formGroup = service.createSupportDeCoursFormGroup(sampleWithRequiredData);

        const supportDeCours = service.getSupportDeCours(formGroup) as any;

        expect(supportDeCours).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISupportDeCours should not enable id FormControl', () => {
        const formGroup = service.createSupportDeCoursFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSupportDeCours should disable id FormControl', () => {
        const formGroup = service.createSupportDeCoursFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
