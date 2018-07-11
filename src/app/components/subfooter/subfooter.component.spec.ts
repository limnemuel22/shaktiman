import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubfooterComponent } from './subfooter.component';

describe('SubfooterComponent', () => {
  let component: SubfooterComponent;
  let fixture: ComponentFixture<SubfooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubfooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
