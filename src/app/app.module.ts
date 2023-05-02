import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ShellModule } from './shell/shell.module';
import { GamesModule } from './pages/games/games.module';
import { SharedModule } from './@shared/components/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    SharedModule,
    GamesModule,
    ShellModule,
    // keep last
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
