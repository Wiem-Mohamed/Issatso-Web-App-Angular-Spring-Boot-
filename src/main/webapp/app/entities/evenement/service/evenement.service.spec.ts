import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEvenement } from '../evenement.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../evenement.test-samples';

import { EvenementService, RestEvenement } from './evenement.service';

const requireRestSample: RestEvenement = {
  ...sampleWithRequiredData,
  dateDebut: sampleWithRequiredData.dateDebut?.toJSON(),
  dateFin: sampleWithRequiredData.dateFin?.toJSON(),
};

describe('Evenement Service', () => {
  let service: EvenementService;
  let httpMock: HttpTestingController;
  let expectedResult: IEvenement | IEvenement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EvenementService);
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

    it('should create a Evenement', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const evenement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(evenement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Evenement', () => {
      const evenement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(evenement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Evenement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Evenement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Evenement', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEvenementToCollectionIfMissing', () => {
      it('should add a Evenement to an empty array', () => {
        const evenement: IEvenement = sampleWithRequiredData;
        expectedResult = service.addEvenementToCollectionIfMissing([], evenement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(evenement);
      });

      it('should not add a Evenement to an array that contains it', () => {
        const evenement: IEvenement = sampleWithRequiredData;
        const evenementCollection: IEvenement[] = [
          {
            ...evenement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEvenementToCollectionIfMissing(evenementCollection, evenement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Evenement to an array that doesn't contain it", () => {
        const evenement: IEvenement = sampleWithRequiredData;
        const evenementCollection: IEvenement[] = [sampleWithPartialData];
        expectedResult = service.addEvenementToCollectionIfMissing(evenementCollection, evenement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(evenement);
      });

      it('should add only unique Evenement to an array', () => {
        const evenementArray: IEvenement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const evenementCollection: IEvenement[] = [sampleWithRequiredData];
        expectedResult = service.addEvenementToCollectionIfMissing(evenementCollection, ...evenementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const evenement: IEvenement = sampleWithRequiredData;
        const evenement2: IEvenement = sampleWithPartialData;
        expectedResult = service.addEvenementToCollectionIfMissing([], evenement, evenement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(evenement);
        expect(expectedResult).toContain(evenement2);
      });

      it('should accept null and undefined values', () => {
        const evenement: IEvenement = sampleWithRequiredData;
        expectedResult = service.addEvenementToCollectionIfMissing([], null, evenement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(evenement);
      });

      it('should return initial array if no Evenement is added', () => {
        const evenementCollection: IEvenement[] = [sampleWithRequiredData];
        expectedResult = service.addEvenementToCollectionIfMissing(evenementCollection, undefined, null);
        expect(expectedResult).toEqual(evenementCollection);
      });
    });

    describe('compareEvenement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEvenement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEvenement(entity1, entity2);
        const compareResult2 = service.compareEvenement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEvenement(entity1, entity2);
        const compareResult2 = service.compareEvenement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEvenement(entity1, entity2);
        const compareResult2 = service.compareEvenement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
