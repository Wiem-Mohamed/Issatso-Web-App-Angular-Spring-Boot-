import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DemandeEtudiantFormService } from './demande-etudiant-form.service';
import { DemandeEtudiantService } from '../service/demande-etudiant.service';
import { IDemandeEtudiant } from '../demande-etudiant.model';

import { DemandeEtudiantUpdateComponent } from './demande-etudiant-update.component';

describe('DemandeEtudiant Management Update Component', () => {
  let comp: DemandeEtudiantUpdateComponent;
  let fixture: ComponentFixture<DemandeEtudiantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let demandeEtudiantFormService: DemandeEtudiantFormService;
  let demandeEtudiantService: DemandeEtudiantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), DemandeEtudiantUpdateComponent],
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
      .overrideTemplate(DemandeEtudiantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DemandeEtudiantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    demandeEtudiantFormService = TestBed.inject(DemandeEtudiantFormService);
    demandeEtudiantService = TestBed.inject(DemandeEtudiantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const demandeEtudiant: IDemandeEtudiant = { id: 456 };

      activatedRoute.data = of({ demandeEtudiant });
      comp.ngOnInit();

      expect(comp.demandeEtudiant).toEqual(demandeEtudiant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDemandeEtudiant>>();
      const demandeEtudiant = { id: 123 };
      jest.spyOn(demandeEtudiantFormService, 'getDemandeEtudiant').mockReturnValue(demandeEtudiant);
      jest.spyOn(demandeEtudiantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ demandeEtudiant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: demandeEtudiant }));
      saveSubject.complete();

      // THEN
      expect(demandeEtudiantFormService.getDemandeEtudiant).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(demandeEtudiantService.update).toHaveBeenCalledWith(expect.objectContaining(demandeEtudiant));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDemandeEtudiant>>();
      const demandeEtudiant = { id: 123 };
      jest.spyOn(demandeEtudiantFormService, 'getDemandeEtudiant').mockReturnValue({ id: null });
      jest.spyOn(demandeEtudiantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ demandeEtudiant: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: demandeEtudiant }));
      saveSubject.complete();

      // THEN
      expect(demandeEtudiantFormService.getDemandeEtudiant).toHaveBeenCalled();
      expect(demandeEtudiantService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDemandeEtudiant>>();
      const demandeEtudiant = { id: 123 };
      jest.spyOn(demandeEtudiantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ demandeEtudiant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(demandeEtudiantService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
