import { Component, OnInit, Input } from '@angular/core';
import { GameBoardService } from '../game-board.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  public usernameInput: string;

  constructor(public gameService: GameBoardService) {}

  ngOnInit() {}

  public addPlayer() {
    this.gameService.addPlayerToRoom(this.usernameInput);
    this.gameService.checkIfGameStarted()
  }
}
