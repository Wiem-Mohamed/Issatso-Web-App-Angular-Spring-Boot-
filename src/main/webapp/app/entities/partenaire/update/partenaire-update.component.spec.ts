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

import { PartenaireUpdateComponent } from './partenaire-update.component';

describe('Partenaire Management Update Component', () => {
  let comp: PartenaireUpdateComponent;
  let fixture: ComponentFixture<PartenaireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let partenaireFormService: PartenaireFormService;
  let partenaireService: PartenaireService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const partenaire: IPartenaire = { id: 456 };

      activatedRoute.data = of({ partenaire });
      comp.ngOnInit();

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
});
