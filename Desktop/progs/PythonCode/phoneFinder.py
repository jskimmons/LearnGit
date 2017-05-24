import sys
import os
import regex
import pyperclip
# 1) take in directory to search, get its full path to parse
target = str(pyperclip.paste())

# 2) set up regex object
phoneRegex = regex.compile(r'''(
	(\d{3}|\(\d{3}\))?  # area code - optional
	(\s|-|\.)?			# seperator
	\d{3}				# first 3 digits
	(\s|-|\.)?			# seperator
	\d{4}				# next 4 digits
	)''', regex.VERBOSE)

# 3) store each number found in a list
results = []
for groups in phoneRegex.findall(target):
	results.append(groups[0])

pyperclip.copy('\n'.join(results))