import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryrecieptComponent } from './deliveryreciept.component';

describe('DeliveryrecieptComponent', () => {
  let component: DeliveryrecieptComponent;
  let fixture: ComponentFixture<DeliveryrecieptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryrecieptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryrecieptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
