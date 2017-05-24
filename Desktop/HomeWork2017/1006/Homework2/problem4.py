'''
Program to print pascal's triangle of any height given by the user

'''

def createRow(length, prevList):
	'''
	Creates a row for a pascal's triangle given a certain length and a the previous
	row
	'''
	newList = []

	for x in range(0,length):
		if x == 0:
			newList.append(1)
		elif x == length - 1:
			newList.append(1)
		else:
			# Uses the previous list to populate the new row
			newList.append(prevList[x-1] + prevList[x])
	return newList

def createTriangle(height):
	'''
	Given a height, it creates a list of rows which correlate to rows of a Pascal's triangle
	'''
	triangle = [[1]]
	for x in range(1, height):
		triangle.append(createRow(x+1, triangle[x-1]))
	return triangle

def printTriangle(triangle):
	'''
	Prints the triangle in a correct looking format
	'''
	# finds largest number of digits in the triangle, for any number
	longestNum = 0
	for row in triangle:
		for num in row:
			if(len(str(num))) > longestNum:
				longestNum = len(str(num))

	for x in range(len(triangle)):
		row = ''
		mult = len(triangle)-x
		# creates empty space prepended to start of each row, to create the triangle
		row += '{:{align}{width}}'.format('',align='^',width=longestNum)*mult
		for y in range(len(triangle[x])):
			if y != len(triangle[x])-1:
				# puts the number in, plus a splace to seperate it from the next number
				row += '{:{align}{width}}'.format(str(triangle[x][y]), align='^', width=longestNum)+\
				'{:{align}{width}}'.format('',align='^',width=longestNum)
			elif y == len(triangle[x])-1:
				row += str(triangle[x][y])
		if row:
			print(row)

height = int(input("What height would you like your triangle?\n"))

#				  Pascal's Triangle, Height of 6
#
#								1
#							1		1
#						1		2		1
#					1		3		3		1
#				1		4		6		4		1
# 			1		5		10		10		5		1

print(printTriangle(createTriangle(height)))

