import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EvenementFormService } from './evenement-form.service';
import { EvenementService } from '../service/evenement.service';
import { IEvenement } from '../evenement.model';
import { IPartenaire } from 'app/entities/partenaire/partenaire.model';
import { PartenaireService } from 'app/entities/partenaire/service/partenaire.service';

import { EvenementUpdateComponent } from './evenement-update.component';

describe('Evenement Management Update Component', () => {
  let comp: EvenementUpdateComponent;
  let fixture: ComponentFixture<EvenementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let evenementFormService: EvenementFormService;
  let evenementService: EvenementService;
  let partenaireService: PartenaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), EvenementUpdateComponent],
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
      .overrideTemplate(EvenementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EvenementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    evenementFormService = TestBed.inject(EvenementFormService);
    evenementService = TestBed.inject(EvenementService);
    partenaireService = TestBed.inject(PartenaireService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Partenaire query and add missing value', () => {
      const evenement: IEvenement = { id: 456 };
      const partenaires: IPartenaire[] = [{ id: 34738 }];
      evenement.partenaires = partenaires;

      const partenaireCollection: IPartenaire[] = [{ id: 92715 }];
      jest.spyOn(partenaireService, 'query').mockReturnValue(of(new HttpResponse({ body: partenaireCollection })));
      const additionalPartenaires = [...partenaires];
      const expectedCollection: IPartenaire[] = [...additionalPartenaires, ...partenaireCollection];
      jest.spyOn(partenaireService, 'addPartenaireToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ evenement });
      comp.ngOnInit();

      expect(partenaireService.query).toHaveBeenCalled();
      expect(partenaireService.addPartenaireToCollectionIfMissing).toHaveBeenCalledWith(
        partenaireCollection,
        ...additionalPartenaires.map(expect.objectContaining)
      );
      expect(comp.partenairesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const evenement: IEvenement = { id: 456 };
      const partenaire: IPartenaire = { id: 21579 };
      evenement.partenaires = [partenaire];

      activatedRoute.data = of({ evenement });
      comp.ngOnInit();

      expect(comp.partenairesSharedCollection).toContain(partenaire);
      expect(comp.evenement).toEqual(evenement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvenement>>();
      const evenement = { id: 123 };
      jest.spyOn(evenementFormService, 'getEvenement').mockReturnValue(evenement);
      jest.spyOn(evenementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ evenement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: evenement }));
      saveSubject.complete();

      // THEN
      expect(evenementFormService.getEvenement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(evenementService.update).toHaveBeenCalledWith(expect.objectContaining(evenement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvenement>>();
      const evenement = { id: 123 };
      jest.spyOn(evenementFormService, 'getEvenement').mockReturnValue({ id: null });
      jest.spyOn(evenementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ evenement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: evenement }));
      saveSubject.complete();

      // THEN
      expect(evenementFormService.getEvenement).toHaveBeenCalled();
      expect(evenementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEvenement>>();
      const evenement = { id: 123 };
      jest.spyOn(evenementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ evenement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(evenementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePartenaire', () => {
      it('Should forward to partenaireService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(partenaireService, 'comparePartenaire');
        comp.comparePartenaire(entity, entity2);
        expect(partenaireService.comparePartenaire).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
