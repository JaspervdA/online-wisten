// We can initialise an interface as follows
// const player = {} as IPlayer;

export interface Room {
  name: string;
  players: Player[];
  games: Game[];
}

export interface Player {
  name: string;
  id: string;
}

export interface Game {
  id: number;
  trumpColor: number;
  cards: number[][];
  playedCards: number[][];
  winners: number[];
  activeRound: number;
}
