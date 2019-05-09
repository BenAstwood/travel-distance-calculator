import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcTravelComponent } from './calc-travel.component';

describe('CalcTravelComponent', () => {
  let component: CalcTravelComponent;
  let fixture: ComponentFixture<CalcTravelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalcTravelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
