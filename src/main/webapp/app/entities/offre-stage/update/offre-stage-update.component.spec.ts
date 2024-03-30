import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OffreStageFormService } from './offre-stage-form.service';
import { OffreStageService } from '../service/offre-stage.service';
import { IOffreStage } from '../offre-stage.model';
import { IDepartement } from 'app/entities/departement/departement.model';
import { DepartementService } from 'app/entities/departement/service/departement.service';

import { OffreStageUpdateComponent } from './offre-stage-update.component';

describe('OffreStage Management Update Component', () => {
  let comp: OffreStageUpdateComponent;
  let fixture: ComponentFixture<OffreStageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let offreStageFormService: OffreStageFormService;
  let offreStageService: OffreStageService;
  let departementService: DepartementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), OffreStageUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OffreStageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OffreStageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    offreStageFormService = TestBed.inject(OffreStageFormService);
    offreStageService = TestBed.inject(OffreStageService);
    departementService = TestBed.inject(DepartementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Departement query and add missing value', () => {
      const offreStage: IOffreStage = { id: 456 };
      const departement: IDepartement = { id: 18219 };
      offreStage.departement = departement;

      const departementCollection: IDepartement[] = [{ id: 44453 }];
      jest.spyOn(departementService, 'query').mockReturnValue(of(new HttpResponse({ body: departementCollection })));
      const additionalDepartements = [departement];
      const expectedCollection: IDepartement[] = [...additionalDepartements, ...departementCollection];
      jest.spyOn(departementService, 'addDepartementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ offreStage });
      comp.ngOnInit();

      expect(departementService.query).toHaveBeenCalled();
      expect(departementService.addDepartementToCollectionIfMissing).toHaveBeenCalledWith(
        departementCollection,
        ...additionalDepartements.map(expect.objectContaining)
      );
      expect(comp.departementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const offreStage: IOffreStage = { id: 456 };
      const departement: IDepartement = { id: 90642 };
      offreStage.departement = departement;

      activatedRoute.data = of({ offreStage });
      comp.ngOnInit();

      expect(comp.departementsSharedCollection).toContain(departement);
      expect(comp.offreStage).toEqual(offreStage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffreStage>>();
      const offreStage = { id: 123 };
      jest.spyOn(offreStageFormService, 'getOffreStage').mockReturnValue(offreStage);
      jest.spyOn(offreStageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offreStage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offreStage }));
      saveSubject.complete();

      // THEN
      expect(offreStageFormService.getOffreStage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(offreStageService.update).toHaveBeenCalledWith(expect.objectContaining(offreStage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffreStage>>();
      const offreStage = { id: 123 };
      jest.spyOn(offreStageFormService, 'getOffreStage').mockReturnValue({ id: null });
      jest.spyOn(offreStageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offreStage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: offreStage }));
      saveSubject.complete();

      // THEN
      expect(offreStageFormService.getOffreStage).toHaveBeenCalled();
      expect(offreStageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOffreStage>>();
      const offreStage = { id: 123 };
      jest.spyOn(offreStageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ offreStage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(offreStageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDepartement', () => {
      it('Should forward to departementService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(departementService, 'compareDepartement');
        comp.compareDepartement(entity, entity2);
        expect(departementService.compareDepartement).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
