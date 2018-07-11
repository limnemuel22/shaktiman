import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteditComponent } from './clientedit.component';

describe('ClienteditComponent', () => {
  let component: ClienteditComponent;
  let fixture: ComponentFixture<ClienteditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
