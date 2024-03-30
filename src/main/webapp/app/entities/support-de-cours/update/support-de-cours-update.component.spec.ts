import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SupportDeCoursFormService } from './support-de-cours-form.service';
import { SupportDeCoursService } from '../service/support-de-cours.service';
import { ISupportDeCours } from '../support-de-cours.model';
import { IMatiere } from 'app/entities/matiere/matiere.model';
import { MatiereService } from 'app/entities/matiere/service/matiere.service';

import { SupportDeCoursUpdateComponent } from './support-de-cours-update.component';

describe('SupportDeCours Management Update Component', () => {
  let comp: SupportDeCoursUpdateComponent;
  let fixture: ComponentFixture<SupportDeCoursUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let supportDeCoursFormService: SupportDeCoursFormService;
  let supportDeCoursService: SupportDeCoursService;
  let matiereService: MatiereService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SupportDeCoursUpdateComponent],
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
      .overrideTemplate(SupportDeCoursUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SupportDeCoursUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    supportDeCoursFormService = TestBed.inject(SupportDeCoursFormService);
    supportDeCoursService = TestBed.inject(SupportDeCoursService);
    matiereService = TestBed.inject(MatiereService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Matiere query and add missing value', () => {
      const supportDeCours: ISupportDeCours = { id: 456 };
      const nomMatiere: IMatiere = { id: 68707 };
      supportDeCours.nomMatiere = nomMatiere;

      const matiereCollection: IMatiere[] = [{ id: 77022 }];
      jest.spyOn(matiereService, 'query').mockReturnValue(of(new HttpResponse({ body: matiereCollection })));
      const additionalMatieres = [nomMatiere];
      const expectedCollection: IMatiere[] = [...additionalMatieres, ...matiereCollection];
      jest.spyOn(matiereService, 'addMatiereToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ supportDeCours });
      comp.ngOnInit();

      expect(matiereService.query).toHaveBeenCalled();
      expect(matiereService.addMatiereToCollectionIfMissing).toHaveBeenCalledWith(
        matiereCollection,
        ...additionalMatieres.map(expect.objectContaining)
      );
      expect(comp.matieresSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const supportDeCours: ISupportDeCours = { id: 456 };
      const nomMatiere: IMatiere = { id: 897 };
      supportDeCours.nomMatiere = nomMatiere;

      activatedRoute.data = of({ supportDeCours });
      comp.ngOnInit();

      expect(comp.matieresSharedCollection).toContain(nomMatiere);
      expect(comp.supportDeCours).toEqual(supportDeCours);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISupportDeCours>>();
      const supportDeCours = { id: 123 };
      jest.spyOn(supportDeCoursFormService, 'getSupportDeCours').mockReturnValue(supportDeCours);
      jest.spyOn(supportDeCoursService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supportDeCours });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: supportDeCours }));
      saveSubject.complete();

      // THEN
      expect(supportDeCoursFormService.getSupportDeCours).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(supportDeCoursService.update).toHaveBeenCalledWith(expect.objectContaining(supportDeCours));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISupportDeCours>>();
      const supportDeCours = { id: 123 };
      jest.spyOn(supportDeCoursFormService, 'getSupportDeCours').mockReturnValue({ id: null });
      jest.spyOn(supportDeCoursService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supportDeCours: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: supportDeCours }));
      saveSubject.complete();

      // THEN
      expect(supportDeCoursFormService.getSupportDeCours).toHaveBeenCalled();
      expect(supportDeCoursService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISupportDeCours>>();
      const supportDeCours = { id: 123 };
      jest.spyOn(supportDeCoursService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supportDeCours });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(supportDeCoursService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMatiere', () => {
      it('Should forward to matiereService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(matiereService, 'compareMatiere');
        comp.compareMatiere(entity, entity2);
        expect(matiereService.compareMatiere).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
