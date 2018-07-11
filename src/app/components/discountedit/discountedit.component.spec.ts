import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscounteditComponent } from './discountedit.component';

describe('DiscounteditComponent', () => {
  let component: DiscounteditComponent;
  let fixture: ComponentFixture<DiscounteditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscounteditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscounteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
