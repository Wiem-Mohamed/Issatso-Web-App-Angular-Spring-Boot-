import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursetudiantComponent } from './coursetudiant.component';

describe('CoursetudiantComponent', () => {
  let component: CoursetudiantComponent;
  let fixture: ComponentFixture<CoursetudiantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursetudiantComponent],
    });
    fixture = TestBed.createComponent(CoursetudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
