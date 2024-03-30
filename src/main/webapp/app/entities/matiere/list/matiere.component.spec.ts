import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MatiereService } from '../service/matiere.service';

import { MatiereComponent } from './matiere.component';

describe('Matiere Management Component', () => {
  let comp: MatiereComponent;
  let fixture: ComponentFixture<MatiereComponent>;
  let service: MatiereService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'matiere', component: MatiereComponent }]),
        HttpClientTestingModule,
        MatiereComponent,
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
      .overrideTemplate(MatiereComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MatiereComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MatiereService);

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
    expect(comp.matieres?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to matiereService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMatiereIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMatiereIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
