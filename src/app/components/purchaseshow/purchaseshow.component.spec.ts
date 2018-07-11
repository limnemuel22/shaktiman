import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseshowComponent } from './purchaseshow.component';

describe('PurchaseshowComponent', () => {
  let component: PurchaseshowComponent;
  let fixture: ComponentFixture<PurchaseshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseshowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
