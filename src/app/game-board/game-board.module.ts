import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board/board.component';
import { CardComponent } from './card/card.component';
import { RoomComponent } from './room/room.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BoardComponent, CardComponent, RoomComponent],
  imports: [CommonModule, FormsModule],
  exports: [RoomComponent]
})
export class GameBoardModule {}
