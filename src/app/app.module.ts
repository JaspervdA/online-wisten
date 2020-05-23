import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameBoardModule } from './game-board/game-board.module';
import { FormsModule } from '@angular/forms';

//FireBase setup
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireDatabase } from 'angularfire2/database';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AngularFireModule.initializeApp(
      environment.firebaseConfig,
      'online-wisten'
    ),
    BrowserModule,
    FormsModule,
    GameBoardModule,
    AppRoutingModule
  ],
  providers: [AngularFireDatabase],
  bootstrap: [AppComponent]
})
export class AppModule {}
