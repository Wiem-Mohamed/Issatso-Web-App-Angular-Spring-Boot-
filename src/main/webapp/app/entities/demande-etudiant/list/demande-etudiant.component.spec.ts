import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DemandeEtudiantService } from '../service/demande-etudiant.service';

import { DemandeEtudiantComponent } from './demande-etudiant.component';

describe('DemandeEtudiant Management Component', () => {
  let comp: DemandeEtudiantComponent;
  let fixture: ComponentFixture<DemandeEtudiantComponent>;
  let service: DemandeEtudiantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'demande-etudiant', component: DemandeEtudiantComponent }]),
        HttpClientTestingModule,
        DemandeEtudiantComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(DemandeEtudiantComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DemandeEtudiantComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DemandeEtudiantService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.demandeEtudiants?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to demandeEtudiantService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDemandeEtudiantIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDemandeEtudiantIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
