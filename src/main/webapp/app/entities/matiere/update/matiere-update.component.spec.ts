import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MatiereFormService } from './matiere-form.service';
import { MatiereService } from '../service/matiere.service';
import { IMatiere } from '../matiere.model';
import { IEnseignant } from 'app/entities/enseignant/enseignant.model';
import { EnseignantService } from 'app/entities/enseignant/service/enseignant.service';

import { MatiereUpdateComponent } from './matiere-update.component';

describe('Matiere Management Update Component', () => {
  let comp: MatiereUpdateComponent;
  let fixture: ComponentFixture<MatiereUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let matiereFormService: MatiereFormService;
  let matiereService: MatiereService;
  let enseignantService: EnseignantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MatiereUpdateComponent],
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
      .overrideTemplate(MatiereUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MatiereUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    matiereFormService = TestBed.inject(MatiereFormService);
    matiereService = TestBed.inject(MatiereService);
    enseignantService = TestBed.inject(EnseignantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Enseignant query and add missing value', () => {
      const matiere: IMatiere = { id: 456 };
      const enseignant: IEnseignant = { id: 88859 };
      matiere.enseignant = enseignant;

      const enseignantCollection: IEnseignant[] = [{ id: 57333 }];
      jest.spyOn(enseignantService, 'query').mockReturnValue(of(new HttpResponse({ body: enseignantCollection })));
      const additionalEnseignants = [enseignant];
      const expectedCollection: IEnseignant[] = [...additionalEnseignants, ...enseignantCollection];
      jest.spyOn(enseignantService, 'addEnseignantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ matiere });
      comp.ngOnInit();

      expect(enseignantService.query).toHaveBeenCalled();
      expect(enseignantService.addEnseignantToCollectionIfMissing).toHaveBeenCalledWith(
        enseignantCollection,
        ...additionalEnseignants.map(expect.objectContaining)
      );
      expect(comp.enseignantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const matiere: IMatiere = { id: 456 };
      const enseignant: IEnseignant = { id: 96520 };
      matiere.enseignant = enseignant;

      activatedRoute.data = of({ matiere });
      comp.ngOnInit();

      expect(comp.enseignantsSharedCollection).toContain(enseignant);
      expect(comp.matiere).toEqual(matiere);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMatiere>>();
      const matiere = { id: 123 };
      jest.spyOn(matiereFormService, 'getMatiere').mockReturnValue(matiere);
      jest.spyOn(matiereService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ matiere });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: matiere }));
      saveSubject.complete();

      // THEN
      expect(matiereFormService.getMatiere).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(matiereService.update).toHaveBeenCalledWith(expect.objectContaining(matiere));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMatiere>>();
      const matiere = { id: 123 };
      jest.spyOn(matiereFormService, 'getMatiere').mockReturnValue({ id: null });
      jest.spyOn(matiereService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ matiere: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: matiere }));
      saveSubject.complete();

      // THEN
      expect(matiereFormService.getMatiere).toHaveBeenCalled();
      expect(matiereService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMatiere>>();
      const matiere = { id: 123 };
      jest.spyOn(matiereService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ matiere });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(matiereService.update).toHaveBeenCalled();
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
