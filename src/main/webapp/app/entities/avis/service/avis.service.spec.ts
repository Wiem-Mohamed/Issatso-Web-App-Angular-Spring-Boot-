import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAvis } from '../avis.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../avis.test-samples';

import { AvisService, RestAvis } from './avis.service';

const requireRestSample: RestAvis = {
  ...sampleWithRequiredData,
  dateCreation: sampleWithRequiredData.dateCreation?.toJSON(),
};

describe('Avis Service', () => {
  let service: AvisService;
  let httpMock: HttpTestingController;
  let expectedResult: IAvis | IAvis[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AvisService);
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

    it('should create a Avis', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const avis = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(avis).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Avis', () => {
      const avis = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(avis).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Avis', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Avis', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Avis', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAvisToCollectionIfMissing', () => {
      it('should add a Avis to an empty array', () => {
        const avis: IAvis = sampleWithRequiredData;
        expectedResult = service.addAvisToCollectionIfMissing([], avis);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(avis);
      });

      it('should not add a Avis to an array that contains it', () => {
        const avis: IAvis = sampleWithRequiredData;
        const avisCollection: IAvis[] = [
          {
            ...avis,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAvisToCollectionIfMissing(avisCollection, avis);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Avis to an array that doesn't contain it", () => {
        const avis: IAvis = sampleWithRequiredData;
        const avisCollection: IAvis[] = [sampleWithPartialData];
        expectedResult = service.addAvisToCollectionIfMissing(avisCollection, avis);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(avis);
      });

      it('should add only unique Avis to an array', () => {
        const avisArray: IAvis[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const avisCollection: IAvis[] = [sampleWithRequiredData];
        expectedResult = service.addAvisToCollectionIfMissing(avisCollection, ...avisArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const avis: IAvis = sampleWithRequiredData;
        const avis2: IAvis = sampleWithPartialData;
        expectedResult = service.addAvisToCollectionIfMissing([], avis, avis2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(avis);
        expect(expectedResult).toContain(avis2);
      });

      it('should accept null and undefined values', () => {
        const avis: IAvis = sampleWithRequiredData;
        expectedResult = service.addAvisToCollectionIfMissing([], null, avis, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(avis);
      });

      it('should return initial array if no Avis is added', () => {
        const avisCollection: IAvis[] = [sampleWithRequiredData];
        expectedResult = service.addAvisToCollectionIfMissing(avisCollection, undefined, null);
        expect(expectedResult).toEqual(avisCollection);
      });
    });

    describe('compareAvis', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAvis(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAvis(entity1, entity2);
        const compareResult2 = service.compareAvis(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAvis(entity1, entity2);
        const compareResult2 = service.compareAvis(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAvis(entity1, entity2);
        const compareResult2 = service.compareAvis(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
