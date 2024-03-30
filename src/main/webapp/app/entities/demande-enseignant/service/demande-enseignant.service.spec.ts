import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDemandeEnseignant } from '../demande-enseignant.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../demande-enseignant.test-samples';

import { DemandeEnseignantService, RestDemandeEnseignant } from './demande-enseignant.service';

const requireRestSample: RestDemandeEnseignant = {
  ...sampleWithRequiredData,
  dateCreation: sampleWithRequiredData.dateCreation?.toJSON(),
};

describe('DemandeEnseignant Service', () => {
  let service: DemandeEnseignantService;
  let httpMock: HttpTestingController;
  let expectedResult: IDemandeEnseignant | IDemandeEnseignant[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DemandeEnseignantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a DemandeEnseignant', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const demandeEnseignant = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(demandeEnseignant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DemandeEnseignant', () => {
      const demandeEnseignant = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(demandeEnseignant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DemandeEnseignant', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DemandeEnseignant', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DemandeEnseignant', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDemandeEnseignantToCollectionIfMissing', () => {
      it('should add a DemandeEnseignant to an empty array', () => {
        const demandeEnseignant: IDemandeEnseignant = sampleWithRequiredData;
        expectedResult = service.addDemandeEnseignantToCollectionIfMissing([], demandeEnseignant);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(demandeEnseignant);
      });

      it('should not add a DemandeEnseignant to an array that contains it', () => {
        const demandeEnseignant: IDemandeEnseignant = sampleWithRequiredData;
        const demandeEnseignantCollection: IDemandeEnseignant[] = [
          {
            ...demandeEnseignant,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDemandeEnseignantToCollectionIfMissing(demandeEnseignantCollection, demandeEnseignant);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DemandeEnseignant to an array that doesn't contain it", () => {
        const demandeEnseignant: IDemandeEnseignant = sampleWithRequiredData;
        const demandeEnseignantCollection: IDemandeEnseignant[] = [sampleWithPartialData];
        expectedResult = service.addDemandeEnseignantToCollectionIfMissing(demandeEnseignantCollection, demandeEnseignant);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(demandeEnseignant);
      });

      it('should add only unique DemandeEnseignant to an array', () => {
        const demandeEnseignantArray: IDemandeEnseignant[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const demandeEnseignantCollection: IDemandeEnseignant[] = [sampleWithRequiredData];
        expectedResult = service.addDemandeEnseignantToCollectionIfMissing(demandeEnseignantCollection, ...demandeEnseignantArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const demandeEnseignant: IDemandeEnseignant = sampleWithRequiredData;
        const demandeEnseignant2: IDemandeEnseignant = sampleWithPartialData;
        expectedResult = service.addDemandeEnseignantToCollectionIfMissing([], demandeEnseignant, demandeEnseignant2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(demandeEnseignant);
        expect(expectedResult).toContain(demandeEnseignant2);
      });

      it('should accept null and undefined values', () => {
        const demandeEnseignant: IDemandeEnseignant = sampleWithRequiredData;
        expectedResult = service.addDemandeEnseignantToCollectionIfMissing([], null, demandeEnseignant, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(demandeEnseignant);
      });

      it('should return initial array if no DemandeEnseignant is added', () => {
        const demandeEnseignantCollection: IDemandeEnseignant[] = [sampleWithRequiredData];
        expectedResult = service.addDemandeEnseignantToCollectionIfMissing(demandeEnseignantCollection, undefined, null);
        expect(expectedResult).toEqual(demandeEnseignantCollection);
      });
    });

    describe('compareDemandeEnseignant', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDemandeEnseignant(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDemandeEnseignant(entity1, entity2);
        const compareResult2 = service.compareDemandeEnseignant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDemandeEnseignant(entity1, entity2);
        const compareResult2 = service.compareDemandeEnseignant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDemandeEnseignant(entity1, entity2);
        const compareResult2 = service.compareDemandeEnseignant(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
