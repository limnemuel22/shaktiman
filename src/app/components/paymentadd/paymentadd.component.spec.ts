import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentaddComponent } from './paymentadd.component';

describe('PaymentaddComponent', () => {
  let component: PaymentaddComponent;
  let fixture: ComponentFixture<PaymentaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
