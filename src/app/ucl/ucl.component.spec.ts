import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UclComponent } from './ucl.component';

describe('UclComponent', () => {
  let component: UclComponent;
  let fixture: ComponentFixture<UclComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UclComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
