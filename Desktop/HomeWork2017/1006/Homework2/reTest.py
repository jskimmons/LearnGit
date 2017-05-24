import re


def hapax(filepath):
    result = 0
    file = open(filepath)
    words = re.findall('\w+', file.read().lower())
    freqs = {key: 0 for key in words}
    for word in words:
        freqs[word] += 1
    for word in freqs:
        if freqs[word] == 1:
        	result+=1
    print(result)

hapax('hapax_test.txt')