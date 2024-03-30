import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EvenementService } from '../service/evenement.service';

import { EvenementComponent } from './evenement.component';

describe('Evenement Management Component', () => {
  let comp: EvenementComponent;
  let fixture: ComponentFixture<EvenementComponent>;
  let service: EvenementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'evenement', component: EvenementComponent }]),
        HttpClientTestingModule,
        EvenementComponent,
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
      .overrideTemplate(EvenementComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EvenementComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EvenementService);

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
    expect(comp.evenements?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to evenementService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEvenementIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEvenementIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
