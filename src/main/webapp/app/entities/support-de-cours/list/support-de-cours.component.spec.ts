import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SupportDeCoursService } from '../service/support-de-cours.service';

import { SupportDeCoursComponent } from './support-de-cours.component';

describe('SupportDeCours Management Component', () => {
  let comp: SupportDeCoursComponent;
  let fixture: ComponentFixture<SupportDeCoursComponent>;
  let service: SupportDeCoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'support-de-cours', component: SupportDeCoursComponent }]),
        HttpClientTestingModule,
        SupportDeCoursComponent,
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
      .overrideTemplate(SupportDeCoursComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SupportDeCoursComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SupportDeCoursService);

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
    expect(comp.supportDeCours?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to supportDeCoursService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSupportDeCoursIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSupportDeCoursIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
