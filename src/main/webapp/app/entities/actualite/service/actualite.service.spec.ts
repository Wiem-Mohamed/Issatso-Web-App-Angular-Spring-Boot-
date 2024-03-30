import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IActualite } from '../actualite.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../actualite.test-samples';

import { ActualiteService, RestActualite } from './actualite.service';

const requireRestSample: RestActualite = {
  ...sampleWithRequiredData,
  datePublication: sampleWithRequiredData.datePublication?.toJSON(),
};

describe('Actualite Service', () => {
  let service: ActualiteService;
  let httpMock: HttpTestingController;
  let expectedResult: IActualite | IActualite[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ActualiteService);
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

    it('should create a Actualite', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const actualite = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(actualite).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Actualite', () => {
      const actualite = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(actualite).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Actualite', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Actualite', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Actualite', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addActualiteToCollectionIfMissing', () => {
      it('should add a Actualite to an empty array', () => {
        const actualite: IActualite = sampleWithRequiredData;
        expectedResult = service.addActualiteToCollectionIfMissing([], actualite);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actualite);
      });

      it('should not add a Actualite to an array that contains it', () => {
        const actualite: IActualite = sampleWithRequiredData;
        const actualiteCollection: IActualite[] = [
          {
            ...actualite,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addActualiteToCollectionIfMissing(actualiteCollection, actualite);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Actualite to an array that doesn't contain it", () => {
        const actualite: IActualite = sampleWithRequiredData;
        const actualiteCollection: IActualite[] = [sampleWithPartialData];
        expectedResult = service.addActualiteToCollectionIfMissing(actualiteCollection, actualite);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actualite);
      });

      it('should add only unique Actualite to an array', () => {
        const actualiteArray: IActualite[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const actualiteCollection: IActualite[] = [sampleWithRequiredData];
        expectedResult = service.addActualiteToCollectionIfMissing(actualiteCollection, ...actualiteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const actualite: IActualite = sampleWithRequiredData;
        const actualite2: IActualite = sampleWithPartialData;
        expectedResult = service.addActualiteToCollectionIfMissing([], actualite, actualite2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actualite);
        expect(expectedResult).toContain(actualite2);
      });

      it('should accept null and undefined values', () => {
        const actualite: IActualite = sampleWithRequiredData;
        expectedResult = service.addActualiteToCollectionIfMissing([], null, actualite, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actualite);
      });

      it('should return initial array if no Actualite is added', () => {
        const actualiteCollection: IActualite[] = [sampleWithRequiredData];
        expectedResult = service.addActualiteToCollectionIfMissing(actualiteCollection, undefined, null);
        expect(expectedResult).toEqual(actualiteCollection);
      });
    });

    describe('compareActualite', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareActualite(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareActualite(entity1, entity2);
        const compareResult2 = service.compareActualite(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareActualite(entity1, entity2);
        const compareResult2 = service.compareActualite(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareActualite(entity1, entity2);
        const compareResult2 = service.compareActualite(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
