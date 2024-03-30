import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../demande-etudiant.test-samples';

import { DemandeEtudiantFormService } from './demande-etudiant-form.service';

describe('DemandeEtudiant Form Service', () => {
  let service: DemandeEtudiantFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeEtudiantFormService);
  });

  describe('Service methods', () => {
    describe('createDemandeEtudiantFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDemandeEtudiantFormGroup();

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

      it('passing IDemandeEtudiant should create a new form with FormGroup', () => {
        const formGroup = service.createDemandeEtudiantFormGroup(sampleWithRequiredData);

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

    describe('getDemandeEtudiant', () => {
      it('should return NewDemandeEtudiant for default DemandeEtudiant initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDemandeEtudiantFormGroup(sampleWithNewData);

        const demandeEtudiant = service.getDemandeEtudiant(formGroup) as any;

        expect(demandeEtudiant).toMatchObject(sampleWithNewData);
      });

      it('should return NewDemandeEtudiant for empty DemandeEtudiant initial value', () => {
        const formGroup = service.createDemandeEtudiantFormGroup();

        const demandeEtudiant = service.getDemandeEtudiant(formGroup) as any;

        expect(demandeEtudiant).toMatchObject({});
      });

      it('should return IDemandeEtudiant', () => {
        const formGroup = service.createDemandeEtudiantFormGroup(sampleWithRequiredData);

        const demandeEtudiant = service.getDemandeEtudiant(formGroup) as any;

        expect(demandeEtudiant).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDemandeEtudiant should not enable id FormControl', () => {
        const formGroup = service.createDemandeEtudiantFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDemandeEtudiant should disable id FormControl', () => {
        const formGroup = service.createDemandeEtudiantFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
