#!/usr/bin/env python3
# -*- coding: utf-8 -*-


#jws2191 Joe Skimmons 

import numpy as np
from matplotlib import pyplot as plt

def euclidean_distance(a,b):
    diff = a - b
    return np.sqrt(np.dot(diff, diff))

def load_data(csv_filename):
    """ 
    Returns a numpy ndarray in which each row repersents
    a wine and each column represents a measurement. There should be 11
    columns (the "quality" column cannot be used for classificaiton).
    """
    data = np.genfromtxt(csv_filename, delimiter=";", skip_header=1, usecols=range(11))
    return data

def split_data(dataset, ratio = 0.9):
    """
    Return a (train, test) tuple of numpy ndarrays. 
    The ratio parameter determines how much of the data should be used for 
    training. For example, 0.9 means that the training portion should contain
    90% of the data. You do not have to randomize the rows. Make sure that 
    there is no overlap. 
    """
    cutoff_row = int(dataset.shape[0] * ratio)
    return (dataset[:cutoff_row], dataset[cutoff_row:])
    
def compute_centroid(data):
    """
    Returns a 1D array (a vector), representing the centroid of the data
    set. 
    """
    return sum(data[:]) / len(data)
    
def experiment(ww_train, rw_train, ww_test, rw_test):
    """
    Train a model on the training data by creating a centroid for each class.
    Then test the model on the test data. Prints the number of total 
    predictions and correct predictions. Returns the accuracy. 
    """
    # First train the data on the training set

    ww_centroid = compute_centroid(ww_train)
    rw_centroid = compute_centroid(rw_train)
    correct_count = 0
    count = 0
    for row in ww_test:
        if euclidean_distance(row, ww_centroid) <= euclidean_distance(row, rw_centroid):
            correct_count+=1
        count+=1
    for row in rw_test:
        if euclidean_distance(row, rw_centroid) <= euclidean_distance(row, ww_centroid):
            correct_count+=1
        count+=1
    accuracy = correct_count/count
    result = "{} total guesses, {} correct guesses, accuracy is {}".format(count, correct_count, accuracy)
    print(result)
    return accuracy

    
def learning_curve(ww_training, rw_training, ww_test, rw_test):
    """
    Perform a series of experiments to compute and plot a learning curve.
    """
    accuracy_list = []
    # finds the smallest number of rows for n
    if ww_training.shape[0] <= rw_training.shape[0]:
        n = ww_training.shape[0]
    else:
        n = rw_training.shape[0]

    for i in range(1,n+1):
        np.random.shuffle(ww_training)
        np.random.shuffle(rw_training)
        recent = experiment(ww_training[:i], rw_training[:i], ww_test, rw_test)
        accuracy_list.append(recent)
    plt.plot(range(1,n+1), accuracy_list)
    
def cross_validation(ww_data, rw_data, k):
    """
    Perform k-fold crossvalidation on the data and print the accuracy for each
    fold. 
    """
    # shuffle the data
    np.random.shuffle(ww_data)
    np.random.shuffle(rw_data)

    # calculate cutoff for each partition
    cutoff = ww_data.shape[0]//k
    redArr = []
    whiteArr = []
    tmpStart = 0
    tmpEnd = cutoff
    
    # create a list of k partitions for red and white data
    for x in range(k):
        if x != k-1:
            redArr.append(rw_data[tmpStart:tmpEnd])
            whiteArr.append(ww_data[tmpStart:tmpEnd])
        else:
            redArr.append(rw_data[tmpStart:])
            whiteArr.append(ww_data[tmpStart:])
        tmpStart+=cutoff
        tmpEnd+=cutoff


    redTraining = np.array(())
    whiteTraining = np.array(())
    accuracy = 0
    count = 0
    
    for x in range(k):
        # creates Test data set
        tmpRedTest = redArr[x]
        tmpWhiteTest = whiteArr[x]
        
        # creates list of partitons for training data set
        if x!=k-1:
            redTrainingList = redArr[:x] + redArr[x+1:]
            whiteTrainingList = whiteArr[:x] + whiteArr[x+1:]
        else:
            redTrainingList = redArr[:x]
            whiteTrainingList = whiteArr[:x]

        # stacks each training list into one nparray
        redTraining = np.vstack(redTrainingList)
        whiteTraining = np.vstack(whiteTrainingList)

        accuracy += experiment(whiteTraining, redTraining, tmpWhiteTest, tmpRedTest)
        count += 1
    # calculates accuracy and returns it
    result = accuracy/count
    return result


    
if __name__ == "__main__":
    
    ww_data = load_data('whitewine.csv')
    rw_data = load_data('redwine.csv')

    # Uncomment the following lines for step 2: 
    ww_train, ww_test = split_data(ww_data, 0.9)
    rw_train, rw_test = split_data(rw_data, 0.9)
    experiment(ww_train, rw_train, ww_test, rw_test)
    
    # Uncomment the following lines for step 3
    ww_train, ww_test = split_data(ww_data, 0.9)
    rw_train, rw_test = split_data(rw_data, 0.9)
    learning_curve(ww_train, rw_train, ww_test, rw_test)
    
    # Uncomment the following lines for step 4:
    k = 10
    acc = cross_validation(ww_data, rw_data, 4)
    print("{}-fold cross-validation accuracy: {}".format(k,acc))
    