import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISupportDeCours } from '../support-de-cours.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../support-de-cours.test-samples';

import { SupportDeCoursService, RestSupportDeCours } from './support-de-cours.service';

const requireRestSample: RestSupportDeCours = {
  ...sampleWithRequiredData,
  dateDepot: sampleWithRequiredData.dateDepot?.toJSON(),
};

describe('SupportDeCours Service', () => {
  let service: SupportDeCoursService;
  let httpMock: HttpTestingController;
  let expectedResult: ISupportDeCours | ISupportDeCours[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SupportDeCoursService);
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

    it('should create a SupportDeCours', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const supportDeCours = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(supportDeCours).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SupportDeCours', () => {
      const supportDeCours = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(supportDeCours).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SupportDeCours', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SupportDeCours', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SupportDeCours', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSupportDeCoursToCollectionIfMissing', () => {
      it('should add a SupportDeCours to an empty array', () => {
        const supportDeCours: ISupportDeCours = sampleWithRequiredData;
        expectedResult = service.addSupportDeCoursToCollectionIfMissing([], supportDeCours);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(supportDeCours);
      });

      it('should not add a SupportDeCours to an array that contains it', () => {
        const supportDeCours: ISupportDeCours = sampleWithRequiredData;
        const supportDeCoursCollection: ISupportDeCours[] = [
          {
            ...supportDeCours,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSupportDeCoursToCollectionIfMissing(supportDeCoursCollection, supportDeCours);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SupportDeCours to an array that doesn't contain it", () => {
        const supportDeCours: ISupportDeCours = sampleWithRequiredData;
        const supportDeCoursCollection: ISupportDeCours[] = [sampleWithPartialData];
        expectedResult = service.addSupportDeCoursToCollectionIfMissing(supportDeCoursCollection, supportDeCours);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(supportDeCours);
      });

      it('should add only unique SupportDeCours to an array', () => {
        const supportDeCoursArray: ISupportDeCours[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const supportDeCoursCollection: ISupportDeCours[] = [sampleWithRequiredData];
        expectedResult = service.addSupportDeCoursToCollectionIfMissing(supportDeCoursCollection, ...supportDeCoursArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const supportDeCours: ISupportDeCours = sampleWithRequiredData;
        const supportDeCours2: ISupportDeCours = sampleWithPartialData;
        expectedResult = service.addSupportDeCoursToCollectionIfMissing([], supportDeCours, supportDeCours2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(supportDeCours);
        expect(expectedResult).toContain(supportDeCours2);
      });

      it('should accept null and undefined values', () => {
        const supportDeCours: ISupportDeCours = sampleWithRequiredData;
        expectedResult = service.addSupportDeCoursToCollectionIfMissing([], null, supportDeCours, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(supportDeCours);
      });

      it('should return initial array if no SupportDeCours is added', () => {
        const supportDeCoursCollection: ISupportDeCours[] = [sampleWithRequiredData];
        expectedResult = service.addSupportDeCoursToCollectionIfMissing(supportDeCoursCollection, undefined, null);
        expect(expectedResult).toEqual(supportDeCoursCollection);
      });
    });

    describe('compareSupportDeCours', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSupportDeCours(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSupportDeCours(entity1, entity2);
        const compareResult2 = service.compareSupportDeCours(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSupportDeCours(entity1, entity2);
        const compareResult2 = service.compareSupportDeCours(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSupportDeCours(entity1, entity2);
        const compareResult2 = service.compareSupportDeCours(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
