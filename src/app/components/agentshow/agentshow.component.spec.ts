import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentshowComponent } from './agentshow.component';

describe('AgentshowComponent', () => {
  let component: AgentshowComponent;
  let fixture: ComponentFixture<AgentshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentshowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
