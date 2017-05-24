'''
Function that uses regular expressions to find the hapex legomena of a given file
Uses a dictionary to determine which words are only used once. Regular expression
for any word found at this location:
	http://stackoverflow.com/questions/1751301/regex-match-entire-words-only
'''
def hapax_legomena(fileName):

	results = []

	searchFile = open(fileName, 'r')

	allWords = searchFile.read().lower()

	# Take the punctuation out of the string
	
	punctuation = ("\",./\\:;!?()-_")
	allWords = ''.join(char for char in allWords if char not in punctuation)
	words = allWords.split()

	# dictionary to hold frequency of each word
	word_frequency = {index: 0 for index in words}

	# increments frequency dictionary for each instance of each word
	for word in words:
		word_frequency[word] += 1
	# finds words which appear 1 time
	for word in words:
		if word_frequency[word] == 1:
			results.append(word)
	return results
	
print(hapax_legomena('hapax_test.txt'))
print("Number of words: " + str(len(hapax_legomena('hapax_test.txt'))))