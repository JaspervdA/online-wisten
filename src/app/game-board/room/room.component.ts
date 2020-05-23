import { Component, OnInit, Input } from '@angular/core';
import { GameBoardService } from '../game-board.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  constructor(public gameService: GameBoardService) {}

  ngOnInit() {
    this.gameService.checkGames()
  }
}
