import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DemandeEnseignantService } from '../service/demande-enseignant.service';

import { DemandeEnseignantComponent } from './demande-enseignant.component';

describe('DemandeEnseignant Management Component', () => {
  let comp: DemandeEnseignantComponent;
  let fixture: ComponentFixture<DemandeEnseignantComponent>;
  let service: DemandeEnseignantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'demande-enseignant', component: DemandeEnseignantComponent }]),
        HttpClientTestingModule,
        DemandeEnseignantComponent,
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
      .overrideTemplate(DemandeEnseignantComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DemandeEnseignantComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DemandeEnseignantService);

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
    expect(comp.demandeEnseignants?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to demandeEnseignantService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDemandeEnseignantIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDemandeEnseignantIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
