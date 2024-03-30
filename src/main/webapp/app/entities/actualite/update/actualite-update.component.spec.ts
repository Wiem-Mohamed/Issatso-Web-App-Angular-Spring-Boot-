import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActualiteFormService } from './actualite-form.service';
import { ActualiteService } from '../service/actualite.service';
import { IActualite } from '../actualite.model';

import { ActualiteUpdateComponent } from './actualite-update.component';

describe('Actualite Management Update Component', () => {
  let comp: ActualiteUpdateComponent;
  let fixture: ComponentFixture<ActualiteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let actualiteFormService: ActualiteFormService;
  let actualiteService: ActualiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ActualiteUpdateComponent],
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
      .overrideTemplate(ActualiteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActualiteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    actualiteFormService = TestBed.inject(ActualiteFormService);
    actualiteService = TestBed.inject(ActualiteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const actualite: IActualite = { id: 456 };

      activatedRoute.data = of({ actualite });
      comp.ngOnInit();

      expect(comp.actualite).toEqual(actualite);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActualite>>();
      const actualite = { id: 123 };
      jest.spyOn(actualiteFormService, 'getActualite').mockReturnValue(actualite);
      jest.spyOn(actualiteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actualite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actualite }));
      saveSubject.complete();

      // THEN
      expect(actualiteFormService.getActualite).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(actualiteService.update).toHaveBeenCalledWith(expect.objectContaining(actualite));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActualite>>();
      const actualite = { id: 123 };
      jest.spyOn(actualiteFormService, 'getActualite').mockReturnValue({ id: null });
      jest.spyOn(actualiteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actualite: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actualite }));
      saveSubject.complete();

      // THEN
      expect(actualiteFormService.getActualite).toHaveBeenCalled();
      expect(actualiteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActualite>>();
      const actualite = { id: 123 };
      jest.spyOn(actualiteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actualite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(actualiteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
