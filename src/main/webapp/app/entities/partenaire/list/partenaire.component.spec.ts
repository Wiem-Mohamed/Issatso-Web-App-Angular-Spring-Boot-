import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PartenaireService } from '../service/partenaire.service';

import { PartenaireComponent } from './partenaire.component';

describe('Partenaire Management Component', () => {
  let comp: PartenaireComponent;
  let fixture: ComponentFixture<PartenaireComponent>;
  let service: PartenaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'partenaire', component: PartenaireComponent }]),
        HttpClientTestingModule,
        PartenaireComponent,
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
      .overrideTemplate(PartenaireComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PartenaireComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PartenaireService);

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
    expect(comp.partenaires?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to partenaireService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPartenaireIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPartenaireIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
