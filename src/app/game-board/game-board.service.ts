import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Game, Player, Room } from './game-board.interface';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  public loadingRoom: boolean = true;
  public gameJoined: boolean = false;
  public gameStarted: boolean = false;
  public roomId: string;
  public roomName: string;
  public cards: number[];
  public games: Observable<Game[]>;
  public gamesRef: AngularFireList<Game[]>;

  public playersRef: AngularFireList<Player>;
  public players: Observable<Player[]>;
  public userName: string;
  private playerId: string;
  // public players: Player[] = [{ name: 'Jasper' }, { name: 'Ellissa' }];

  constructor(private db: AngularFireDatabase) {}

  public checkGames() {
    // this.gamesRef = db.list(`/rooms/${this.roomId}/games`);
    // this.games = this.gamesRef.valueChanges();
    // this.games.subscribe(games => console.log(games));
  }

  public createRoom() {
    const newRoom = {
      name: this.roomName,
      games: [{} as Game],
      players: [{} as Player]
    } as Room;

    const roomId = this.makeId(6);
    this.db.database
      .ref(`rooms/${roomId}`)
      .set(newRoom)
      .then(response => this.joinRoom(roomId));
  }

  public joinRoom(roomId: string) {
    this.roomId = roomId;
    this.playersRef = this.db.list(`/rooms/${this.roomId}/players`);
    this.players = this.playersRef.valueChanges();
    this.gameJoined = true;
  }

  public addPlayerToRoom(newPlayerName: string) {
    if (this.playerId) {
      return;
    }
    this.userName = newPlayerName;
    this.playerId = this.makeId(12);
    this.playersRef.push({ name: newPlayerName, id: this.playerId });
  }

  public checkIfGameStarted() {
    this.players.subscribe((players: Player[]) => {
      players.length === 4 ? (this.gameStarted = true) : console.log(players);
    });
  }

  public startGame() {
    this.gameStarted = true;
  }

  public getCards() {
    this.cards = Array.from(Array(52).keys());
  }

  public checkIfValidRoomId(roomId: string) {
    this.db.database
      .ref('rooms')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()[roomId]) {
          this.roomId = roomId;
          this.loadingRoom = false;
          this.roomName = snapshot.val()[roomId].name;
          this.joinRoom(roomId);
        } else {
          this.loadingRoom = false;
          alert('De ingevoerde spelcode bestaat niet');
          return;
        }
      });
  }

  private makeId(idLength: number): string {
    let id = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < idLength; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
  }
}
