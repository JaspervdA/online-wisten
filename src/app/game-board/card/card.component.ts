import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() cardValue: number;
  cardNumber: number;
  cardType: number;
  deckSize: number = 13;
  cardTypes: string[] = [
    '/assets/images/hearts.png',
    '/assets/images/diamonds.png',
    '/assets/images/clubs.png',
    '/assets/images/spades.png'
  ];

  constructor() {}

  ngOnInit() {
    this.getCardTypeAndNumber();
  }

  private getCardTypeAndNumber() {
    this.cardNumber = 1 + this.cardValue % this.deckSize;
    this.cardType = Math.floor(this.cardValue / this.deckSize);
    console.log(this.cardNumber, this.cardType);
  }
}
