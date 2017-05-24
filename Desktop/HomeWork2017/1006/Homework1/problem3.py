# jws2191

''' This program is a guessing game that gives interactive hints and terminates
	after five tries'''
import random

# Step 1: generate a random number between 1 and 10

s = random.randint(1,10)
target = int(s)

# Step 2: allow user to input guesses, run if statements to print hints

num_tries = 0
guess = 0

while num_tries < 5 and guess != target:

	s = input('Pick a number between 1 and 10: ')
	guess = int(s)
	
	# makes sure the number is valid, between 1 and 10
	while guess > 10 or guess < 1:
		s = input('Number not between 1 and 10: ')
		guess = int(s)

	num_tries += 1

	if target == guess:
		print('You win!')

	elif abs(target - guess) > 5:
		print('not even close')
	
	elif abs(target - guess) <= 5 and abs(target - guess) >= 3:
		print('close')
	
	elif abs(target - guess) < 3:
		print ('nearly there')

if guess != target:
	print('Too many tries, game over :(')

