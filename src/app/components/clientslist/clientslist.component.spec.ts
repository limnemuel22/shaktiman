import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientslistComponent } from './clientslist.component';

describe('ClientslistComponent', () => {
  let component: ClientslistComponent;
  let fixture: ComponentFixture<ClientslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
