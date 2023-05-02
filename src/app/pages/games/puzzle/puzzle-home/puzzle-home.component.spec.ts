import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleHomeComponent } from './puzzle-home.component';

describe('PuzzleHomeComponent', () => {
  let component: PuzzleHomeComponent;
  let fixture: ComponentFixture<PuzzleHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuzzleHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
