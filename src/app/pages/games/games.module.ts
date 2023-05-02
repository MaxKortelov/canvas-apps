import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesComponent } from './games.component';
import { PuzzleModule } from './puzzle/puzzle.module';
import { GamesRoutingModule } from './games-routing.module';

@NgModule({
  declarations: [GamesComponent],
  imports: [CommonModule, GamesRoutingModule, PuzzleModule]
})
export class GamesModule {}
