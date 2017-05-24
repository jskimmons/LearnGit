class Fibonacci(object):
	def __init__(self):
		self.fib0 = 1
		self.fib1 = 1
		self.count = 0

	def __next__(self):
		if self.count == 0 or self.count == 1:
			self.count+=1
			return 1

		self.fib1 = self.fib0
		nextFib = self.fib0 + self.fib1
		self.fib0 = nextFib
		count+=1
		return self.fib1

	def __iter__():
		return self

def main():
	sequence = Fibonacci()
	for fib in range(10):
		print(next(fib))

if __name__ == '__main__':
	main()