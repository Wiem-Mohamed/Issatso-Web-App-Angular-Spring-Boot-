import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEnseignant } from '../enseignant.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../enseignant.test-samples';

import { EnseignantService, RestEnseignant } from './enseignant.service';

const requireRestSample: RestEnseignant = {
  ...sampleWithRequiredData,
  dateEmbauche: sampleWithRequiredData.dateEmbauche?.toJSON(),
};

describe('Enseignant Service', () => {
  let service: EnseignantService;
  let httpMock: HttpTestingController;
  let expectedResult: IEnseignant | IEnseignant[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EnseignantService);
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

    it('should create a Enseignant', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const enseignant = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(enseignant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Enseignant', () => {
      const enseignant = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(enseignant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Enseignant', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Enseignant', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Enseignant', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEnseignantToCollectionIfMissing', () => {
      it('should add a Enseignant to an empty array', () => {
        const enseignant: IEnseignant = sampleWithRequiredData;
        expectedResult = service.addEnseignantToCollectionIfMissing([], enseignant);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(enseignant);
      });

      it('should not add a Enseignant to an array that contains it', () => {
        const enseignant: IEnseignant = sampleWithRequiredData;
        const enseignantCollection: IEnseignant[] = [
          {
            ...enseignant,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEnseignantToCollectionIfMissing(enseignantCollection, enseignant);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Enseignant to an array that doesn't contain it", () => {
        const enseignant: IEnseignant = sampleWithRequiredData;
        const enseignantCollection: IEnseignant[] = [sampleWithPartialData];
        expectedResult = service.addEnseignantToCollectionIfMissing(enseignantCollection, enseignant);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(enseignant);
      });

      it('should add only unique Enseignant to an array', () => {
        const enseignantArray: IEnseignant[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const enseignantCollection: IEnseignant[] = [sampleWithRequiredData];
        expectedResult = service.addEnseignantToCollectionIfMissing(enseignantCollection, ...enseignantArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const enseignant: IEnseignant = sampleWithRequiredData;
        const enseignant2: IEnseignant = sampleWithPartialData;
        expectedResult = service.addEnseignantToCollectionIfMissing([], enseignant, enseignant2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(enseignant);
        expect(expectedResult).toContain(enseignant2);
      });

      it('should accept null and undefined values', () => {
        const enseignant: IEnseignant = sampleWithRequiredData;
        expectedResult = service.addEnseignantToCollectionIfMissing([], null, enseignant, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(enseignant);
      });

      it('should return initial array if no Enseignant is added', () => {
        const enseignantCollection: IEnseignant[] = [sampleWithRequiredData];
        expectedResult = service.addEnseignantToCollectionIfMissing(enseignantCollection, undefined, null);
        expect(expectedResult).toEqual(enseignantCollection);
      });
    });

    describe('compareEnseignant', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEnseignant(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEnseignant(entity1, entity2);
        const compareResult2 = service.compareEnseignant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEnseignant(entity1, entity2);
        const compareResult2 = service.compareEnseignant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEnseignant(entity1, entity2);
        const compareResult2 = service.compareEnseignant(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
