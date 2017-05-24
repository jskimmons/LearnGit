# script to find phone numbers in a given directory
import sys
import os
import regex
import pyperclip

target = str(pyperclip.paste())

phoneRegex = regex.compile(r'''(
	(\d{3}|\(\d{3}\))?    # area code - optional
	(\s|-|\.)?            # seperator
	\d{3}                 # first 3 digits
	(\s|-|\.)?            # seperator
	\d{4}                 # next 4 digits
	)''', regex.VERBOSE)

results = []
for groups in phoneRegex.findall(target):
	results.append(groups[0])

pyperclip.copy('\n'.join(results))
