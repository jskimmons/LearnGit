class Person(object):
	def __init__(self, name):
		self.name = name
	def speak(self):
		return "{}".format(self.name)

class Employer(Person):
	def __init__(self, name, title):
		self.name = name
		self.title = title

class Employee(Employer):
	def __init__(self, name, ID):
		self.name = name
		self.ID = ID
	def speak(self):
		return "{}, {}".format(self.name, self.ID)
	def work(self):
		return "{} is working".format(self.name)

def main():
	person1 = Employee("Joe", 1)
	print(person1.speak())
	print(person1.work())

	person2 = Person("Jake")
	print(person2.speak())
	print(person2.work())

	person3 = Employer("Josh", "Vice President")
	print(person3.speak())

if __name__ == '__main__':
	main()