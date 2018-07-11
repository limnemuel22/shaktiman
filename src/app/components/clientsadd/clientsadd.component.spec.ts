import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsaddComponent } from './clientsadd.component';

describe('ClientsaddComponent', () => {
  let component: ClientsaddComponent;
  let fixture: ComponentFixture<ClientsaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
