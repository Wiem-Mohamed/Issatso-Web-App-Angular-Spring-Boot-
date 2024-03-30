import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../offre-stage.test-samples';

import { OffreStageFormService } from './offre-stage-form.service';

describe('OffreStage Form Service', () => {
  let service: OffreStageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffreStageFormService);
  });

  describe('Service methods', () => {
    describe('createOffreStageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOffreStageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titre: expect.any(Object),
            description: expect.any(Object),
            domaine: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            entreprise: expect.any(Object),
            lieu: expect.any(Object),
            departement: expect.any(Object),
          })
        );
      });

      it('passing IOffreStage should create a new form with FormGroup', () => {
        const formGroup = service.createOffreStageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titre: expect.any(Object),
            description: expect.any(Object),
            domaine: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            entreprise: expect.any(Object),
            lieu: expect.any(Object),
            departement: expect.any(Object),
          })
        );
      });
    });

    describe('getOffreStage', () => {
      it('should return NewOffreStage for default OffreStage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOffreStageFormGroup(sampleWithNewData);

        const offreStage = service.getOffreStage(formGroup) as any;

        expect(offreStage).toMatchObject(sampleWithNewData);
      });

      it('should return NewOffreStage for empty OffreStage initial value', () => {
        const formGroup = service.createOffreStageFormGroup();

        const offreStage = service.getOffreStage(formGroup) as any;

        expect(offreStage).toMatchObject({});
      });

      it('should return IOffreStage', () => {
        const formGroup = service.createOffreStageFormGroup(sampleWithRequiredData);

        const offreStage = service.getOffreStage(formGroup) as any;

        expect(offreStage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOffreStage should not enable id FormControl', () => {
        const formGroup = service.createOffreStageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOffreStage should disable id FormControl', () => {
        const formGroup = service.createOffreStageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
