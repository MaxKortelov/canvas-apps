import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuzzleComponent } from './puzzle.component';
import { PuzzleHomeComponent } from './puzzle-home/puzzle-home.component';
import { PuzzleGameComponent } from './puzzle-game/puzzle-game.component';
import { PuzzleResultsComponent } from './puzzle-results/puzzle-results.component';
import { StoreModule } from '@ngrx/store';
import { puzleGameReducer } from './state/puzzle.reducer';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [PuzzleComponent, PuzzleHomeComponent, PuzzleGameComponent, PuzzleResultsComponent],
  imports: [CommonModule, StoreModule.forFeature('puzzleGame', puzleGameReducer), EffectsModule.forRoot([])]
})
export class PuzzleModule {}