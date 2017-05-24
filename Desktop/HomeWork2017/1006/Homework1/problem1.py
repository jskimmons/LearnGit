# jws2191

''' This program will take in an integer, between 1 and 86,400. It will return
	the hour, minute, and second where that integer, in seconds, occurs during 
	the day. '''

# Step 1: take in integer from user

s = input('Enter a number between 1 and 86400, inclusive: ')
total = int(s)

# Step 2: Find the number of hours by dividing by the number of seconds in an hour
# Integer division to return a whole number, modulus to get the 
# remainder for future calculations

hours = total//(60*60)
total = total % (60*60)

# Step 3: Find the number of minutes by dividing the remainder by the number 
# of second in a minute

minutes = total//(60)
total = total % (60)

# Step 4: Whatever is leftover is the number of seconds

seconds = total

print("%d Hours: %d Minutes: %d Seconds" % (hours, minutes, seconds))