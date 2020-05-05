import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board/board.component';
import { CardComponent } from './card/card.component';
import { RoomComponent } from './room/room.component';

@NgModule({
  declarations: [BoardComponent, CardComponent, RoomComponent],
  imports: [CommonModule],
  exports: [RoomComponent]
})
export class GameBoardModule {}
