import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientshowComponent } from './clientshow.component';

describe('ClientshowComponent', () => {
  let component: ClientshowComponent;
  let fixture: ComponentFixture<ClientshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientshowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
