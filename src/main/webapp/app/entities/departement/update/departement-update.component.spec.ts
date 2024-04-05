import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DepartementFormService } from './departement-form.service';
import { DepartementService } from '../service/departement.service';
import { IDepartement } from '../departement.model';
import { IEnseignant } from 'app/entities/enseignant/enseignant.model';
import { EnseignantService } from 'app/entities/enseignant/service/enseignant.service';

import { DepartementUpdateComponent } from './departement-update.component';

describe('Departement Management Update Component', () => {
  let comp: DepartementUpdateComponent;
  let fixture: ComponentFixture<DepartementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let departementFormService: DepartementFormService;
  let departementService: DepartementService;
  let enseignantService: EnseignantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), DepartementUpdateComponent],
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
      .overrideTemplate(DepartementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DepartementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    departementFormService = TestBed.inject(DepartementFormService);
    departementService = TestBed.inject(DepartementService);
    enseignantService = TestBed.inject(EnseignantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call enseignant query and add missing value', () => {
      const departement: IDepartement = { id: 456 };
      const enseignant: IEnseignant = { id: 73273 };
      departement.enseignant = enseignant;

      const enseignantCollection: IEnseignant[] = [{ id: 18543 }];
      jest.spyOn(enseignantService, 'query').mockReturnValue(of(new HttpResponse({ body: enseignantCollection })));
      const expectedCollection: IEnseignant[] = [enseignant, ...enseignantCollection];
      jest.spyOn(enseignantService, 'addEnseignantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ departement });
      comp.ngOnInit();

      expect(enseignantService.query).toHaveBeenCalled();
      expect(enseignantService.addEnseignantToCollectionIfMissing).toHaveBeenCalledWith(enseignantCollection, enseignant);
      expect(comp.enseignantsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const departement: IDepartement = { id: 456 };
      const enseignant: IEnseignant = { id: 32058 };
      departement.enseignant = enseignant;

      activatedRoute.data = of({ departement });
      comp.ngOnInit();

      expect(comp.enseignantsCollection).toContain(enseignant);
      expect(comp.departement).toEqual(departement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartement>>();
      const departement = { id: 123 };
      jest.spyOn(departementFormService, 'getDepartement').mockReturnValue(departement);
      jest.spyOn(departementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ departement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: departement }));
      saveSubject.complete();

      // THEN
      expect(departementFormService.getDepartement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(departementService.update).toHaveBeenCalledWith(expect.objectContaining(departement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartement>>();
      const departement = { id: 123 };
      jest.spyOn(departementFormService, 'getDepartement').mockReturnValue({ id: null });
      jest.spyOn(departementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ departement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: departement }));
      saveSubject.complete();

      // THEN
      expect(departementFormService.getDepartement).toHaveBeenCalled();
      expect(departementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartement>>();
      const departement = { id: 123 };
      jest.spyOn(departementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ departement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(departementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEnseignant', () => {
      it('Should forward to enseignantService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(enseignantService, 'compareEnseignant');
        comp.compareEnseignant(entity, entity2);
        expect(enseignantService.compareEnseignant).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
