import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  gameJoined: boolean = false;
  gameStarted: boolean = false;
  userName: string;
  roomId: number = 1;
  cards: number[];

  constructor() {}

  public joinRoom() {
    this.gameJoined = true;
  }

  public startGame() {
    this.gameStarted = true;
  }

  public getCards() {
    this.cards = Array.from(Array(52).keys());
  }
}
