import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  gameJoined: boolean = false;
  userName: string;
  roomId: number = 1;

  constructor() { }

  public joinRoom() {
    this.gameJoined = true
  }
}
