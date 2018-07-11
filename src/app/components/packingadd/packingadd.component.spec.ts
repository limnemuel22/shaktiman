import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingaddComponent } from './packingadd.component';

describe('PackingaddComponent', () => {
  let component: PackingaddComponent;
  let fixture: ComponentFixture<PackingaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
