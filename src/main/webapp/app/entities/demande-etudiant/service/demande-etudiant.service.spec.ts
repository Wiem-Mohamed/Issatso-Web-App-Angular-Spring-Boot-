import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDemandeEtudiant } from '../demande-etudiant.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../demande-etudiant.test-samples';

import { DemandeEtudiantService, RestDemandeEtudiant } from './demande-etudiant.service';

const requireRestSample: RestDemandeEtudiant = {
  ...sampleWithRequiredData,
  dateCreation: sampleWithRequiredData.dateCreation?.toJSON(),
};

describe('DemandeEtudiant Service', () => {
  let service: DemandeEtudiantService;
  let httpMock: HttpTestingController;
  let expectedResult: IDemandeEtudiant | IDemandeEtudiant[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DemandeEtudiantService);
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

    it('should create a DemandeEtudiant', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const demandeEtudiant = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(demandeEtudiant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DemandeEtudiant', () => {
      const demandeEtudiant = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(demandeEtudiant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DemandeEtudiant', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DemandeEtudiant', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DemandeEtudiant', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDemandeEtudiantToCollectionIfMissing', () => {
      it('should add a DemandeEtudiant to an empty array', () => {
        const demandeEtudiant: IDemandeEtudiant = sampleWithRequiredData;
        expectedResult = service.addDemandeEtudiantToCollectionIfMissing([], demandeEtudiant);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(demandeEtudiant);
      });

      it('should not add a DemandeEtudiant to an array that contains it', () => {
        const demandeEtudiant: IDemandeEtudiant = sampleWithRequiredData;
        const demandeEtudiantCollection: IDemandeEtudiant[] = [
          {
            ...demandeEtudiant,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDemandeEtudiantToCollectionIfMissing(demandeEtudiantCollection, demandeEtudiant);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DemandeEtudiant to an array that doesn't contain it", () => {
        const demandeEtudiant: IDemandeEtudiant = sampleWithRequiredData;
        const demandeEtudiantCollection: IDemandeEtudiant[] = [sampleWithPartialData];
        expectedResult = service.addDemandeEtudiantToCollectionIfMissing(demandeEtudiantCollection, demandeEtudiant);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(demandeEtudiant);
      });

      it('should add only unique DemandeEtudiant to an array', () => {
        const demandeEtudiantArray: IDemandeEtudiant[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const demandeEtudiantCollection: IDemandeEtudiant[] = [sampleWithRequiredData];
        expectedResult = service.addDemandeEtudiantToCollectionIfMissing(demandeEtudiantCollection, ...demandeEtudiantArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const demandeEtudiant: IDemandeEtudiant = sampleWithRequiredData;
        const demandeEtudiant2: IDemandeEtudiant = sampleWithPartialData;
        expectedResult = service.addDemandeEtudiantToCollectionIfMissing([], demandeEtudiant, demandeEtudiant2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(demandeEtudiant);
        expect(expectedResult).toContain(demandeEtudiant2);
      });

      it('should accept null and undefined values', () => {
        const demandeEtudiant: IDemandeEtudiant = sampleWithRequiredData;
        expectedResult = service.addDemandeEtudiantToCollectionIfMissing([], null, demandeEtudiant, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(demandeEtudiant);
      });

      it('should return initial array if no DemandeEtudiant is added', () => {
        const demandeEtudiantCollection: IDemandeEtudiant[] = [sampleWithRequiredData];
        expectedResult = service.addDemandeEtudiantToCollectionIfMissing(demandeEtudiantCollection, undefined, null);
        expect(expectedResult).toEqual(demandeEtudiantCollection);
      });
    });

    describe('compareDemandeEtudiant', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDemandeEtudiant(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDemandeEtudiant(entity1, entity2);
        const compareResult2 = service.compareDemandeEtudiant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDemandeEtudiant(entity1, entity2);
        const compareResult2 = service.compareDemandeEtudiant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDemandeEtudiant(entity1, entity2);
        const compareResult2 = service.compareDemandeEtudiant(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
