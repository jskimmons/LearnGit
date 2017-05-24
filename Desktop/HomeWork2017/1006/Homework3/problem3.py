'''
Joe Skimmons
'''

import random

class Card(object):  
    
    def __init__(self, suit, rank):
        self.suit = suit
        self.rank = rank      

    def __str__(self):
        return '{}{}'.format(self.suit, self.rank)

    def value(self, total):
        faceCards = "KQJ"
        if self.rank in faceCards:
            return 10
        elif self.rank in "A":
            if total <= 11:
                return 10
            else:
                return 1
        else:
            return int(self.rank)

def make_deck():

    suits = ['♠','♣','♦','♥']
    faceCards = ['J', 'Q', 'K', 'A']
    deck = []
    for x in range(2,11):
        deck.append(Card(suits[0], str(x)))
        deck.append(Card(suits[1], str(x)))
        deck.append(Card(suits[2], str(x)))
        deck.append(Card(suits[3], str(x)))
    for x in faceCards:
        deck.append(Card(suits[0], x))
        deck.append(Card(suits[1], x))
        deck.append(Card(suits[2], x))
        deck.append(Card(suits[3], x))

    random.shuffle(deck)
    return deck


def main():
    deck = make_deck()
    player_sum = 0
    dealer_sum = 0
    player_move=""
    #player_move = input("Would you like to draw another card? (y/n)")
    while player_move != 'n':
        next_card = deck[0]
        print("You drew " + str(next_card))
        player_sum += next_card.value(player_sum)
        deck.pop(0)
        print("Sum: " + str(player_sum))
        if player_sum == 21:
            print("Blackjack! You win!")
            exit()
        elif player_sum > 21:
            print("You lose!")
            exit()
        player_move = input("Would you like to draw another card? (y/n)")

    print("My turn.")

    while dealer_sum < 17:
        next_card = deck[0]
        print("I drew " + str(next_card))
        dealer_sum += next_card.value(dealer_sum)
        deck.pop(0)
        print("Sum: " + str(dealer_sum))
        if dealer_sum == 21:
            print("Blackjack! I win!")
            exit()
        elif dealer_sum > 21:
            print("You win!")
            exit()
    if dealer_sum == player_sum:
        print("Push")
    if dealer_sum > player_sum:
        print("I win!")
    elif dealer_sum < player_sum:
        print("You win!")

if __name__ == "__main__":
    main()
