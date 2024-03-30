import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../demande-enseignant.test-samples';

import { DemandeEnseignantFormService } from './demande-enseignant-form.service';

describe('DemandeEnseignant Form Service', () => {
  let service: DemandeEnseignantFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeEnseignantFormService);
  });

  describe('Service methods', () => {
    describe('createDemandeEnseignantFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDemandeEnseignantFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sujet: expect.any(Object),
            description: expect.any(Object),
            statut: expect.any(Object),
            dateCreation: expect.any(Object),
          })
        );
      });

      it('passing IDemandeEnseignant should create a new form with FormGroup', () => {
        const formGroup = service.createDemandeEnseignantFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sujet: expect.any(Object),
            description: expect.any(Object),
            statut: expect.any(Object),
            dateCreation: expect.any(Object),
          })
        );
      });
    });

    describe('getDemandeEnseignant', () => {
      it('should return NewDemandeEnseignant for default DemandeEnseignant initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDemandeEnseignantFormGroup(sampleWithNewData);

        const demandeEnseignant = service.getDemandeEnseignant(formGroup) as any;

        expect(demandeEnseignant).toMatchObject(sampleWithNewData);
      });

      it('should return NewDemandeEnseignant for empty DemandeEnseignant initial value', () => {
        const formGroup = service.createDemandeEnseignantFormGroup();

        const demandeEnseignant = service.getDemandeEnseignant(formGroup) as any;

        expect(demandeEnseignant).toMatchObject({});
      });

      it('should return IDemandeEnseignant', () => {
        const formGroup = service.createDemandeEnseignantFormGroup(sampleWithRequiredData);

        const demandeEnseignant = service.getDemandeEnseignant(formGroup) as any;

        expect(demandeEnseignant).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDemandeEnseignant should not enable id FormControl', () => {
        const formGroup = service.createDemandeEnseignantFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDemandeEnseignant should disable id FormControl', () => {
        const formGroup = service.createDemandeEnseignantFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
