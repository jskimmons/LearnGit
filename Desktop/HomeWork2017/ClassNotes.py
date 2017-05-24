# script to create a new file each time it is run, already with a header

# file name follows the format (CLASS)-(DATE).txt

''' header follows the format:

    CLASS                                                   DATE

'''
import sys
import os
import time

# 1. take in argument from user for class name

className = sys.argv[1]

# 2. create file in specific path, with file naming convention

path = os.path.join(os.getcwd(), className + 'Notes/')
fileName = className + time.strftime("%d_%m") + '.txt'

file = open(os.path.join(path, fileName), 'a+')


# 3. write header to file (proper alignment), use shelf variable to
header = className + '\n' + time.strftime("%d.%m.%y") + '\n'

file.write(header)
# DOESNT WORK os.system("Pages.app " + fileName)

