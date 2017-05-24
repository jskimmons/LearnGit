import random
import math
from matplotlib import pyplot as plt

def normpdf(x, mean, sd):
	"""
	Return the value of the normal distribution 
	with the specified mean and standard deviation (sd) at
	position x.
	You do not have to understand how this function works exactly. 
	"""
	var = float(sd)**2
	denom = (2*math.pi*var)**.5
	num = math.exp(-(float(x)-float(mean))**2/(2*var))
	return num/denom

	
recovery_time = 2; # recovery time in time-steps
virality = 1.0    # probability that a neighbor cell is infected in 
				  # each time step                                                  

class Cell(object):

	def __init__(self,x, y):
		self.counter = 0
		self.x = x
		self.y = y 
		self.state = "S" # can be "S" (susceptible), "R" (resistant = dead), or 
						 # "I" (infected)
		
	def infect(self):
		if self.state in "S":
			self.state = "I"

	def process(self, adjacent_cells):
		# keeps a counter on the number of days a cell has been infected
		if self.state in "I":
			self.counter += 1
		# checks if the cell has entered the "recovery period" and heals it if so
		if self.state in "I" and self.counter >= recovery_time:
			self.state = "S"
			self.counter = 0
		# determines if the cell dies if it has not been recovered
		if self.state in "I" and random.random() <= normpdf(self.counter, 0.5, 1):
			self.state = "R"
		# infects the adjacent cells randomlys
		if self.state in "I":
			for cell in adjacent_cells:
				if cell.state in "S" and random.random() <= virality:
					cell.infect()
		
class Map(object):
	
	def __init__(self):
		self.height = 150
		self.width = 150           
		self.cells = {}

	def time_step(self):
		for cell in self.cells.values():
			cell.process(self.adjacent_cells(cell.x, cell.y))
		self.display()

	def add_cell(self, cell):
		self.cells[(cell.x, cell.y)] = cell
		
	def display(self):
		# Go through (0,y) to (150, y) and (x, 0) to (x, 150) add to list
		# black if not in map state if in map

		img = []
		tmp = []

		state = { "S" : (0.0,1.0,0.0),
				  "I" : (1.0,0.0,0.0),
				  "R" : (0.5,0.5,0.5),
				  "B" : (0.0,0.0,0.0)
				}

		for x in range(self.width):
			for y in range(self.height):
				if (x,y) in self.cells:
					tmp.append(state[self.cells[(x,y)].state])
				else:
					tmp.append(state["B"])
			img.append(tmp)
			tmp = []
		
		plt.imshow(img)
	
	def adjacent_cells(self, x, y):
		adj_cells = []
		for i in [-1,1]:
			if (x+i,y) in self.cells:
				adj_cells.append(self.cells[(x+i,y)])
			if (x, y+i) in self.cells:
				adj_cells.append(self.cells[(x,y+i)])
		return adj_cells
	  
def read_map(filename):
	
	m = Map()
	file = open(filename)
	for line in file:
		line = line.replace("\n","")
		lineList = line.split(",")
		x = int(lineList[0])
		y = int(lineList[1])
		m.add_cell(Cell(x,y))
	
	return m