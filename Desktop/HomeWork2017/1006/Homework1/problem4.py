# jws2191

''' This program works through the Collatz Conjecture and
	prints each step from a given number until it reaches 1 '''

# Step 1: Take in a number from the user
s = input('Pick any integer\n')
num = int(s)

# Step 2: determine if the number is even or odd, using modulus 
# perform operations accordingly

while num != 1:
	if num % 2 == 0:
		num = num//2
		print(num)
	else:
		num = num*3 + 1
		print(num)

