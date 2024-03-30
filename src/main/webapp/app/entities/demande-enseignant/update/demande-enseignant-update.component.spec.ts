import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DemandeEnseignantFormService } from './demande-enseignant-form.service';
import { DemandeEnseignantService } from '../service/demande-enseignant.service';
import { IDemandeEnseignant } from '../demande-enseignant.model';

import { DemandeEnseignantUpdateComponent } from './demande-enseignant-update.component';

describe('DemandeEnseignant Management Update Component', () => {
  let comp: DemandeEnseignantUpdateComponent;
  let fixture: ComponentFixture<DemandeEnseignantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let demandeEnseignantFormService: DemandeEnseignantFormService;
  let demandeEnseignantService: DemandeEnseignantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), DemandeEnseignantUpdateComponent],
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
      .overrideTemplate(DemandeEnseignantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DemandeEnseignantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    demandeEnseignantFormService = TestBed.inject(DemandeEnseignantFormService);
    demandeEnseignantService = TestBed.inject(DemandeEnseignantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const demandeEnseignant: IDemandeEnseignant = { id: 456 };

      activatedRoute.data = of({ demandeEnseignant });
      comp.ngOnInit();

      expect(comp.demandeEnseignant).toEqual(demandeEnseignant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDemandeEnseignant>>();
      const demandeEnseignant = { id: 123 };
      jest.spyOn(demandeEnseignantFormService, 'getDemandeEnseignant').mockReturnValue(demandeEnseignant);
      jest.spyOn(demandeEnseignantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ demandeEnseignant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: demandeEnseignant }));
      saveSubject.complete();

      // THEN
      expect(demandeEnseignantFormService.getDemandeEnseignant).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(demandeEnseignantService.update).toHaveBeenCalledWith(expect.objectContaining(demandeEnseignant));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDemandeEnseignant>>();
      const demandeEnseignant = { id: 123 };
      jest.spyOn(demandeEnseignantFormService, 'getDemandeEnseignant').mockReturnValue({ id: null });
      jest.spyOn(demandeEnseignantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ demandeEnseignant: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: demandeEnseignant }));
      saveSubject.complete();

      // THEN
      expect(demandeEnseignantFormService.getDemandeEnseignant).toHaveBeenCalled();
      expect(demandeEnseignantService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDemandeEnseignant>>();
      const demandeEnseignant = { id: 123 };
      jest.spyOn(demandeEnseignantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ demandeEnseignant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(demandeEnseignantService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
