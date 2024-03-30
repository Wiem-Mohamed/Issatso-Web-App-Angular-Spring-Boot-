import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AvisFormService } from './avis-form.service';
import { AvisService } from '../service/avis.service';
import { IAvis } from '../avis.model';

import { AvisUpdateComponent } from './avis-update.component';

describe('Avis Management Update Component', () => {
  let comp: AvisUpdateComponent;
  let fixture: ComponentFixture<AvisUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let avisFormService: AvisFormService;
  let avisService: AvisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AvisUpdateComponent],
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
      .overrideTemplate(AvisUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AvisUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    avisFormService = TestBed.inject(AvisFormService);
    avisService = TestBed.inject(AvisService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const avis: IAvis = { id: 456 };

      activatedRoute.data = of({ avis });
      comp.ngOnInit();

      expect(comp.avis).toEqual(avis);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAvis>>();
      const avis = { id: 123 };
      jest.spyOn(avisFormService, 'getAvis').mockReturnValue(avis);
      jest.spyOn(avisService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ avis });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: avis }));
      saveSubject.complete();

      // THEN
      expect(avisFormService.getAvis).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(avisService.update).toHaveBeenCalledWith(expect.objectContaining(avis));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAvis>>();
      const avis = { id: 123 };
      jest.spyOn(avisFormService, 'getAvis').mockReturnValue({ id: null });
      jest.spyOn(avisService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ avis: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: avis }));
      saveSubject.complete();

      // THEN
      expect(avisFormService.getAvis).toHaveBeenCalled();
      expect(avisService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAvis>>();
      const avis = { id: 123 };
      jest.spyOn(avisService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ avis });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(avisService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
