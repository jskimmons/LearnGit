'''
Joe Skimmons, jws2191
'''
#from collections import defaultdict
import string

def count_ngrams(file_name, n=2): 
    """
    This function reads an input file and returns a dictionary of n-gram counts.  
    file_name is a string, n is an integer. 
    The result dictionary maps n-grams to their frequency (i.e. the count of 
    how often that n-gram appears). Each n-gram key is a tuple and the count is
    an int.
    """
    # The defaultdict class may be useful here. Check the python 
    # documentation for more information: 
    # https://docs.python.org/3/library/collections.html#collections.defaultdict

    file = open(file_name, "r")
    text = []
    gram_dict = {}
    for line in file:
        exclude = set(string.punctuation)
        line = ''.join(char for char in line if char not in exclude)
        line = line.replace("\n", "").lower()
        text.extend(line.split())

    for wordIndex in range(0,len(text)-n+1):
        tmpLi = []
        for x in range(0,n):
            tmpLi.append(text[wordIndex + x])
        tup = tuple(tmpLi)
        if tup not in gram_dict:
            gram_dict[tup] = 1
        else:
            gram_dict[tup] += 1
    return gram_dict

def single_occurences(ngram_count_dict): 
    """
    This functions takes in a dictionary (in the format produces by 
    count_ngrams) and returns a list of all ngrans with only 1 occurence.
    That is, this function should return a list of all n-grams with a count
    of 1. 
    """
    occurs_once = []
    for key in ngram_count_dict:
        if ngram_count_dict[key] == 1:
            occurs_once.append(key)
    return occurs_once

def most_frequent(ngram_count_dict, num = 5): 
    """
    This function takes in two parameters: 
        ngram_count_dict is a dictionary of ngram counts. 
        num denotes the number of n-grams to return.       
    This function returns a list of the num n-grams with the highest
    occurence in the file. For example if num=10, the method should 
    return the 10 most frequent ngrams in a list. 
    """
    # Hint: For this you will need to sort the information in the dict 
    # Python does not support any way of sorting dicts 
    # You will have to convert the dict into a list of (frequency, n-gram)
    # tuples, sort the list based on frequency, and return a list of the num
    # n-grams with the highest frequency. 
    # NOTE: you should NOT return the frequencies, just a list of the n-grams

    ngram_list = ngram_count_dict.items()
    ngram_list_sorted = sorted(ngram_list, key=lambda x: x[1], reverse=True)
    freq_list=[]
    for x in range(0, num):
    	freq_list.append(ngram_list_sorted[x][0])
    return freq_list

def main():
    filename = "alice.txt"
    n = 2
    most_frequent_k = 5

    ngram_counts = count_ngrams(filename, n)
    print('{}-grams that occur only once:'.format(n))
    print(single_occurences(ngram_counts))
    print('{} most frequent {}-grams:'.format(most_frequent_k, n))
    print(most_frequent(ngram_counts, most_frequent_k))

if __name__ == "__main__":
    main()
