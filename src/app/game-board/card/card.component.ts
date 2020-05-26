import { Component, OnInit, Input } from '@angular/core';
import { GameBoardService } from '../game-board.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() cardValue: number;
  @Input() clickable: boolean = false;
  @Input() firebaseIndex: number;
  cardNumber: string;
  cardType: number;
  specialCards: { number: number; replaceWith: string }[] = [
    { number: 11, replaceWith: 'J' },
    { number: 12, replaceWith: 'Q' },
    { number: 13, replaceWith: 'K' },
    { number: 14, replaceWith: 'A' }
  ];
  deckSize: number = 13;
  cardTypes: string[] = [
    '/assets/images/clubs.png',
    '/assets/images/diamonds.png',
    '/assets/images/spades.png',
    '/assets/images/hearts.png'
  ];

  constructor(public gameService: GameBoardService) {}

  ngOnInit() {
    this.getCardTypeAndNumber();
  }

  private getCardTypeAndNumber() {
    const cardIndex = 2 + this.cardValue % this.deckSize;
    this.cardType = Math.floor(this.cardValue / this.deckSize);

    this.cardNumber = String(cardIndex);
    this.specialCards.forEach(specialCard => {
      if (cardIndex === specialCard.number) {
        this.cardNumber = specialCard.replaceWith;
      }
    });
  }

  public clickCard() {
    if (this.clickable) {
      this.gameService.playCard(this.cardValue, this.firebaseIndex);
    }
  }
}
