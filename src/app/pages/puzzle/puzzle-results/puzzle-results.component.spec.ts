import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleResultsComponent } from './puzzle-results.component';

describe('PuzzleResultsComponent', () => {
  let component: PuzzleResultsComponent;
  let fixture: ComponentFixture<PuzzleResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuzzleResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
