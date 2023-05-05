import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuzzleComponent } from './puzzle.component';
import { PuzzleHomeComponent } from './puzzle-home/puzzle-home.component';
import { PuzzleGameComponent } from './puzzle-game/puzzle-game.component';
import { PuzzleResultsComponent } from './puzzle-results/puzzle-results.component';
import { StoreModule } from '@ngrx/store';
import { puzleGameReducer } from './state/puzzle.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PuzzleRoutingModule } from './puzzle-routing.module';
import { SharedModule } from '../../../shared/components/shared.module';
import { PuzzleEffects } from './state/puzzle.effects';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PuzzleComponent, PuzzleHomeComponent, PuzzleGameComponent, PuzzleResultsComponent],
  imports: [
    CommonModule,
    PuzzleRoutingModule,
    RouterModule,
    StoreModule.forFeature('puzzleGame', puzleGameReducer),
    EffectsModule.forFeature([PuzzleEffects]),
    SharedModule
  ]
})
export class PuzzleModule {}
