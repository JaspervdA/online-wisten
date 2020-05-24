import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable, BehaviorSubject, combineLatest, interval } from 'rxjs';
import { Game, Player, Room } from './game-board.interface';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  public loadingRoom: boolean = true;
  public gameJoined: boolean = false;
  public gameStarted: boolean = false;
  public startingNewRound: boolean = false;
  public roomId: string;
  public roomName: string;
  public tempCards: number[][];

  public playersRef: AngularFireList<Player>;
  public players: Observable<Player[]>;
  public gamesRef: AngularFireList<Game>;
  public games: Observable<Game[]>;
  public cardsRef: AngularFireList<number>;
  public cards: Observable<number[]>;
  public playedCardsRef: AngularFireList<number>;
  public playedCards: Observable<number[]>;
  public winnersRef: AngularFireList<number>;
  public winners: Observable<number[]>;

  public staticPlayers: Player[];
  public userName: string;
  public playerId: string;
  public myPlayerIndex: number;

  private cardPlayed: boolean = false;
  public gameId: number = 0;
  public roundId: number = 0;

  constructor(private db: AngularFireDatabase) {}

  public createRoom() {
    const newRoom = {
      name: this.roomName,
      games: [{ id: 0 } as Game]
    } as Room;

    const roomId = this.makeId(6);
    this.db.database
      .ref(`rooms/${roomId}`)
      .set(newRoom)
      .then(response => this.joinRoom(roomId));
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
      if (players.length === 4) {
        this.startFirstGame(players);
      }
    });
  }

  private startFirstGame(players: Player[]) {
    this.staticPlayers = players;
    this.getMyPlayerIndex(players);
    this.gamesRef = this.db.list(`/rooms/${this.roomId}/games`);
    this.games = this.gamesRef.valueChanges();
    this.startNewGame();
  }

  public startNewGame() {
    // One player shuffles the cards
    if (this.playerId === this.staticPlayers[0].id) {
      this.getCards();
    }
    this.checkIfGamesChanged();
  }

  private getMyPlayerIndex(players: Player[]) {
    // Find the index of the active player
    players.forEach((player, index) => {
      if (this.playerId === player.id) {
        this.myPlayerIndex = index;
      }
    });
  }

  private checkIfGamesChanged() {
    this.games.subscribe((games: Game[]) => {
      if (this.gameStarted) {
        if (this.startingNewRound) {
          this.checkIfNewRoundHasStarted(games);
        } else {
          this.checkIfRoundIsDone();
        }
      } else {
        this.getGameObservables();
      }
    });
  }

  public playCard(cardValue: number, firebaseIndex: number) {
    if (this.cardPlayed === true) {
      return;
    }

    this.uploadPlayedCard(cardValue, firebaseIndex);
  }

  private uploadPlayedCard(cardValue: number, firebaseIndex: number) {
    this.cardPlayed = true;
    this.playedCardsRef.set(`${this.myPlayerIndex}`, cardValue);
    this.cardsRef.set(`${firebaseIndex}`, -1);
  }

  private checkIfRoundIsDone() {
    this.playedCards.pipe(take(1)).subscribe(playedCards => {
      if (playedCards.indexOf(-1) < 0) {
        this.endRound(playedCards);
      }
    });
  }

  private checkIfNewRoundHasStarted(games: Game[]) {
    const databaseActiveRound: number = games[this.gameId].activeRound;

    if (databaseActiveRound === -1) {
      this.gameId += 1;
      this.roundId = 0;
      this.startingNewRound = false;
      this.gameStarted = false;
      this.startNewGame();
    } else if (databaseActiveRound > this.roundId) {
      this.roundId += 1;
      this.startingNewRound = false;
      this.getPlayedCardsObservable();
    }
  }

  private endRound(playedCards: number[]) {
    // A second function call, return
    if (this.startingNewRound) {
      return;
    }

    this.startingNewRound = true;
    this.cardPlayed = false;
    // The first player computes and submits the winner
    if (this.playerId === this.staticPlayers[0].id) {
      this.computeWinner(this.roundId, playedCards);
    }
  }

  public startNewRound() {
    // The player that clicks the button starts the new round
    this.games.pipe(take(1)).subscribe((games: Game[]) => {
      const databaseActiveRound: number = games[this.gameId].activeRound;

      if (databaseActiveRound === 12) {
        // If this is the final round set the activeRound number to -1
        // @ts-ignore
        this.gamesRef.set(`${this.gameId}/activeRound`, -1);
      } else if (databaseActiveRound === this.roundId) {
        this.roundId += 1;
        this.startingNewRound = false;
        // @ts-ignore
        this.gamesRef.set(`${this.gameId}/activeRound`, this.roundId);
        this.getPlayedCardsObservable();
      }
    });
  }

  private getGameObservables() {
    this.cardsRef = this.db.list(
      `/rooms/${this.roomId}/games/${this.gameId}/cards/${this.myPlayerIndex}`
    );
    this.cards = this.cardsRef.valueChanges();

    this.winnersRef = this.db.list(
      `rooms/${this.roomId}/games/${this.gameId}/winners`
    );
    this.winners = this.winnersRef.valueChanges();

    this.getPlayedCardsObservable();
    this.gameStarted = true;
  }

  private getPlayedCardsObservable() {
    this.playedCardsRef = this.db.list(
      `/rooms/${this.roomId}/games/${this.gameId}/playedCards/${this.roundId}`
    );
    this.playedCards = this.playedCardsRef.valueChanges();
  }

  private initNewGameRound() {
    this.gameId += 1;
    // One player shuffles the cards
    if (this.playerId === this.staticPlayers[0].id) {
      this.getCards();
    }
  }

  private computeWinner(roundId: number, playedCards: number[]) {
    let startingPlayer: number;

    if (roundId === 0) {
      // In the first round the starting player can be retrieved from the gameId
      startingPlayer = this.gameId % 4;
      this.getWinner(roundId, playedCards, startingPlayer);
    } else {
      // Get starting player from previous round
      this.winners.pipe(take(1)).subscribe((winners: number[]) => {
        startingPlayer = winners[roundId - 1];
        this.getWinner(roundId, playedCards, startingPlayer);
      });
    }
  }

  private getWinner(
    roundId: number,
    playedCards: number[],
    startingPlayer: number
  ) {
    let trumpColor: number = 0;
    let startingColor: number;
    let cardStrengths: number[];

    startingColor = Math.floor(playedCards[startingPlayer] / 13);
    cardStrengths = playedCards.map((cardValue: number) => {
      return this.getCardStrength(cardValue, trumpColor, startingColor);
    });

    this.winnersRef.set(`${roundId}`, this.indexOfMax(cardStrengths));
  }

  private getCardStrength(
    cardValue: number,
    trumpColor: number,
    startingColor: number
  ): number {
    let cardIndex = cardValue % 13;
    let cardType = Math.floor(cardValue / 13);
    let cardStrength: number;
    if (cardType === trumpColor) {
      cardStrength = cardIndex + 200;
    } else if (cardType === startingColor) {
      cardStrength = cardIndex + 100;
    } else {
      cardStrength = cardIndex;
    }
    return cardStrength;
  }

  private getCards() {
    const newGame = {
      cards: this.initialiseCards(),
      playedCards: this.initialisePlayedCards(),
      winners: this.initialiseWinners(),
      activeRound: 0
    } as Game;

    this.db.database
      .ref(`rooms/${this.roomId}/games/${this.gameId}`)
      .set(newGame);
  }

  private shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
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

  private initialisePlayedCards(): number[][] {
    let playedRound: number[] = new Array(4).fill(-1);
    let playedCards: number[][] = [];
    for (let i = 0; i < 13; i++) {
      playedCards.push(playedRound);
    }
    return playedCards;
  }

  private initialiseCards(): number[][] {
    let allCards: number[] = Array.from(Array(52).keys());
    this.shuffleArray(allCards);
    let cards: number[][] = [];
    for (let i = 0; i < 4; i++) {
      cards.push(allCards.splice(0, 13));
    }
    return cards;
  }

  private initialiseWinners(): number[] {
    let winners: number[] = new Array(13).fill(-1);
    return winners;
  }

  private indexOfMax(arr: number[]) {
    if (arr.length === 0) {
      return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        maxIndex = i;
        max = arr[i];
      }
    }

    return maxIndex;
  }
}
