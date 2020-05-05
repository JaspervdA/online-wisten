import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  gameJoined: boolean = false;
  userName: string;
  roomId: number = 1;

  constructor(private af: AngularFireDatabase) { }

  public joinRoom() {
    this.gameJoined = true
    console.log(this.af.list('/').update('hello world'))
  }


}
