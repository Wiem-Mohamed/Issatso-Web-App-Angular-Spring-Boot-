import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EnseignantFormService } from './enseignant-form.service';
import { EnseignantService } from '../service/enseignant.service';
import { IEnseignant } from '../enseignant.model';
import { IGroupe } from 'app/entities/groupe/groupe.model';
import { GroupeService } from 'app/entities/groupe/service/groupe.service';

import { EnseignantUpdateComponent } from './enseignant-update.component';

describe('Enseignant Management Update Component', () => {
  let comp: EnseignantUpdateComponent;
  let fixture: ComponentFixture<EnseignantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let enseignantFormService: EnseignantFormService;
  let enseignantService: EnseignantService;
  let groupeService: GroupeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), EnseignantUpdateComponent],
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
      .overrideTemplate(EnseignantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EnseignantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    enseignantFormService = TestBed.inject(EnseignantFormService);
    enseignantService = TestBed.inject(EnseignantService);
    groupeService = TestBed.inject(GroupeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Groupe query and add missing value', () => {
      const enseignant: IEnseignant = { id: 456 };
      const groupes: IGroupe[] = [{ id: 26729 }];
      enseignant.groupes = groupes;

      const groupeCollection: IGroupe[] = [{ id: 72856 }];
      jest.spyOn(groupeService, 'query').mockReturnValue(of(new HttpResponse({ body: groupeCollection })));
      const additionalGroupes = [...groupes];
      const expectedCollection: IGroupe[] = [...additionalGroupes, ...groupeCollection];
      jest.spyOn(groupeService, 'addGroupeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ enseignant });
      comp.ngOnInit();

      expect(groupeService.query).toHaveBeenCalled();
      expect(groupeService.addGroupeToCollectionIfMissing).toHaveBeenCalledWith(
        groupeCollection,
        ...additionalGroupes.map(expect.objectContaining)
      );
      expect(comp.groupesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const enseignant: IEnseignant = { id: 456 };
      const groupe: IGroupe = { id: 20524 };
      enseignant.groupes = [groupe];

      activatedRoute.data = of({ enseignant });
      comp.ngOnInit();

      expect(comp.groupesSharedCollection).toContain(groupe);
      expect(comp.enseignant).toEqual(enseignant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEnseignant>>();
      const enseignant = { id: 123 };
      jest.spyOn(enseignantFormService, 'getEnseignant').mockReturnValue(enseignant);
      jest.spyOn(enseignantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ enseignant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: enseignant }));
      saveSubject.complete();

      // THEN
      expect(enseignantFormService.getEnseignant).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(enseignantService.update).toHaveBeenCalledWith(expect.objectContaining(enseignant));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEnseignant>>();
      const enseignant = { id: 123 };
      jest.spyOn(enseignantFormService, 'getEnseignant').mockReturnValue({ id: null });
      jest.spyOn(enseignantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ enseignant: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: enseignant }));
      saveSubject.complete();

      // THEN
      expect(enseignantFormService.getEnseignant).toHaveBeenCalled();
      expect(enseignantService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEnseignant>>();
      const enseignant = { id: 123 };
      jest.spyOn(enseignantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ enseignant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(enseignantService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareGroupe', () => {
      it('Should forward to groupeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(groupeService, 'compareGroupe');
        comp.compareGroupe(entity, entity2);
        expect(groupeService.compareGroupe).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
