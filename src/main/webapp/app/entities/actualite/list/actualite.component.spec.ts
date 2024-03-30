import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActualiteService } from '../service/actualite.service';

import { ActualiteComponent } from './actualite.component';

describe('Actualite Management Component', () => {
  let comp: ActualiteComponent;
  let fixture: ComponentFixture<ActualiteComponent>;
  let service: ActualiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'actualite', component: ActualiteComponent }]),
        HttpClientTestingModule,
        ActualiteComponent,
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
      .overrideTemplate(ActualiteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActualiteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ActualiteService);

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
    expect(comp.actualites?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to actualiteService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getActualiteIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getActualiteIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
