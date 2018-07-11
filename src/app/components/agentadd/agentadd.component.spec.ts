import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentaddComponent } from './agentadd.component';

describe('AgentaddComponent', () => {
  let component: AgentaddComponent;
  let fixture: ComponentFixture<AgentaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
