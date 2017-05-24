'''
This program converts any given word to pig latin using specific rules
'''

vowels = "aeiouAEIOU"
def doggify(word):
	'''
	This function looks for vowels in the word to determine what to append
	to the end of the word
	'''
	sliceIndex = 0
	containsVowels = True
	while word[sliceIndex] not in vowels and sliceIndex != len(word) - 1:
		sliceIndex+=1
		if sliceIndex == len(word) - 1:
			containsVowels = False
	if not containsVowels:
		doggified_word = word + "ay"	
	elif sliceIndex != 0:
		doggified_word = word[sliceIndex:] + word[:sliceIndex] + "ay"
	else:
		doggified_word = word + "yay"

	return doggified_word

uInput = ""
while True:
	uInput = str(input("Enter a word to be doggified!: "))
	
	if uInput == "." :
		print("Goodbye")
		break

	print(doggify(uInput))



