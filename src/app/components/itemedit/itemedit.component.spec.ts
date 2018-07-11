import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemeditComponent } from './itemedit.component';

describe('ItemeditComponent', () => {
  let component: ItemeditComponent;
  let fixture: ComponentFixture<ItemeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
