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

import { EvenementUpdateComponent } from './evenement-update.component';

describe('Evenement Management Update Component', () => {
  let comp: EvenementUpdateComponent;
  let fixture: ComponentFixture<EvenementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let evenementFormService: EvenementFormService;
  let evenementService: EvenementService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const evenement: IEvenement = { id: 456 };

      activatedRoute.data = of({ evenement });
      comp.ngOnInit();

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
});
