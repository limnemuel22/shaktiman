import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemshowComponent } from './itemshow.component';

describe('ItemshowComponent', () => {
  let component: ItemshowComponent;
  let fixture: ComponentFixture<ItemshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemshowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
