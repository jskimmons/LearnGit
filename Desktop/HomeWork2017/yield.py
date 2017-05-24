def test():
	x = 1
	y = 3
	yield x
	yield y


def main():
	print(next(test()))
	print(next(test()))

if __name__ == '__main__':
	main()