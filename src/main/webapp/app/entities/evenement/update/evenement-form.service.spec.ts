import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../evenement.test-samples';

import { EvenementFormService } from './evenement-form.service';

describe('Evenement Form Service', () => {
  let service: EvenementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvenementFormService);
  });

  describe('Service methods', () => {
    describe('createEvenementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEvenementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titre: expect.any(Object),
            description: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            lieu: expect.any(Object),
            partenaires: expect.any(Object),
          })
        );
      });

      it('passing IEvenement should create a new form with FormGroup', () => {
        const formGroup = service.createEvenementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            titre: expect.any(Object),
            description: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            lieu: expect.any(Object),
            partenaires: expect.any(Object),
          })
        );
      });
    });

    describe('getEvenement', () => {
      it('should return NewEvenement for default Evenement initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEvenementFormGroup(sampleWithNewData);

        const evenement = service.getEvenement(formGroup) as any;

        expect(evenement).toMatchObject(sampleWithNewData);
      });

      it('should return NewEvenement for empty Evenement initial value', () => {
        const formGroup = service.createEvenementFormGroup();

        const evenement = service.getEvenement(formGroup) as any;

        expect(evenement).toMatchObject({});
      });

      it('should return IEvenement', () => {
        const formGroup = service.createEvenementFormGroup(sampleWithRequiredData);

        const evenement = service.getEvenement(formGroup) as any;

        expect(evenement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEvenement should not enable id FormControl', () => {
        const formGroup = service.createEvenementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEvenement should disable id FormControl', () => {
        const formGroup = service.createEvenementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
