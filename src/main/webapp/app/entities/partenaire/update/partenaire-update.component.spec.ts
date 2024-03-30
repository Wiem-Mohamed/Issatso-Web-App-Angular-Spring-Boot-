import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PartenaireFormService } from './partenaire-form.service';
import { PartenaireService } from '../service/partenaire.service';
import { IPartenaire } from '../partenaire.model';
import { IEvenement } from 'app/entities/evenement/evenement.model';
import { EvenementService } from 'app/entities/evenement/service/evenement.service';

import { PartenaireUpdateComponent } from './partenaire-update.component';

describe('Partenaire Management Update Component', () => {
  let comp: PartenaireUpdateComponent;
  let fixture: ComponentFixture<PartenaireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let partenaireFormService: PartenaireFormService;
  let partenaireService: PartenaireService;
  let evenementService: EvenementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PartenaireUpdateComponent],
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
      .overrideTemplate(PartenaireUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PartenaireUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    partenaireFormService = TestBed.inject(PartenaireFormService);
    partenaireService = TestBed.inject(PartenaireService);
    evenementService = TestBed.inject(EvenementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Evenement query and add missing value', () => {
      const partenaire: IPartenaire = { id: 456 };
      const evenements: IEvenement[] = [{ id: 72149 }];
      partenaire.evenements = evenements;

      const evenementCollection: IEvenement[] = [{ id: 45498 }];
      jest.spyOn(evenementService, 'query').mockReturnValue(of(new HttpResponse({ body: evenementCollection })));
      const additionalEvenements = [...evenements];
      const expectedCollection: IEvenement[] = [...additionalEvenements, ...evenementCollection];
      jest.spyOn(evenementService, 'addEvenementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ partenaire });
      comp.ngOnInit();

      expect(evenementService.query).toHaveBeenCalled();
      expect(evenementService.addEvenementToCollectionIfMissing).toHaveBeenCalledWith(
        evenementCollection,
        ...additionalEvenements.map(expect.objectContaining)
      );
      expect(comp.evenementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const partenaire: IPartenaire = { id: 456 };
      const evenement: IEvenement = { id: 21351 };
      partenaire.evenements = [evenement];

      activatedRoute.data = of({ partenaire });
      comp.ngOnInit();

      expect(comp.evenementsSharedCollection).toContain(evenement);
      expect(comp.partenaire).toEqual(partenaire);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPartenaire>>();
      const partenaire = { id: 123 };
      jest.spyOn(partenaireFormService, 'getPartenaire').mockReturnValue(partenaire);
      jest.spyOn(partenaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partenaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: partenaire }));
      saveSubject.complete();

      // THEN
      expect(partenaireFormService.getPartenaire).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(partenaireService.update).toHaveBeenCalledWith(expect.objectContaining(partenaire));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPartenaire>>();
      const partenaire = { id: 123 };
      jest.spyOn(partenaireFormService, 'getPartenaire').mockReturnValue({ id: null });
      jest.spyOn(partenaireService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partenaire: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: partenaire }));
      saveSubject.complete();

      // THEN
      expect(partenaireFormService.getPartenaire).toHaveBeenCalled();
      expect(partenaireService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPartenaire>>();
      const partenaire = { id: 123 };
      jest.spyOn(partenaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partenaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(partenaireService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEvenement', () => {
      it('Should forward to evenementService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(evenementService, 'compareEvenement');
        comp.compareEvenement(entity, entity2);
        expect(evenementService.compareEvenement).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
