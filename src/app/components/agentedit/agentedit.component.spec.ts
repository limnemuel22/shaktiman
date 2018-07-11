import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgenteditComponent } from './agentedit.component';

describe('AgenteditComponent', () => {
  let component: AgenteditComponent;
  let fixture: ComponentFixture<AgenteditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgenteditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgenteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
