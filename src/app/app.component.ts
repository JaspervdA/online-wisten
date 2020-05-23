import { Component } from '@angular/core';
import { GameBoardService } from './game-board/game-board.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public gameIdInput: string;

  constructor(
    public gameService: GameBoardService,
    private location: Location
  ) {}

  ngOnInit() {
    this.checkRouteForRoomId();
  }

  private checkRouteForRoomId() {
    const url = this.location.path();
    if (!url) {
      this.gameService.loadingRoom = false;
      return;
    }
    const roomId = url.substr(1);
    this.gameService.checkIfValidRoomId(roomId);
  }

  public joinRoom() {
    this.gameService.loadingRoom = true
    this.gameService.checkIfValidRoomId(this.gameIdInput);
  }
}
