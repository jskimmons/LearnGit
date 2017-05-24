'''
This is a basic dialog system that prompts the user to
order pizza

@author Joe Skimmons, jws2191

'''
# Two lists to hold the customer's orders
order = []

def select_meal():
	'''
	Takes input from user to select a meal
	'''
	possible_orders = ["pizza" , "pasta" , "salad", "no"]
	meal = input("Would you like pizza, pasta, or salad?\n")
	while meal.lower() not in possible_orders:
		meal = input("Sorry, we don't have " + meal + " today! Choose again:\n")
	choice = meal
	if choice == "salad":
		order.append(salad())
		select_meal();
	elif choice == "pizza":
		order.append(pizza())
		select_meal();
	elif choice == "pasta":
		order.append(pasta())
		select_meal();
	elif choice == "no":
		if not order:
			print("You ordered nothing :)")
		else:
			print("You ordered: ")
			for element in order:
				print(element)
			print("Thanks for ordering! Goodbye :)")
	
def salad():
	'''
	Takes input from user to select a salad
	'''
	possible_salad = ["garden" , "greek"]
	salad = input("Would you like a garden salad or a greek salad?\n")
	while salad.lower() not in possible_salad:
		salad = input("Sorry, we don't have " + "\'" + salad + "\'" + " Salad today!\n")
	pickedDressing = dressing()
	print("A " + salad + " salad " + " with " + pickedDressing + " dressing.")
	return "A " + salad + " salad " + " with " + pickedDressing + " dressing."

def pasta():
	'''
	Takes input from user to select a pasta
	'''
	print("Sorry, no pasta today!")

def pizza():
	'''
	Takes input from user to select a pizza
	'''

	possible_sizes = ["small" , "medium" , "large"]
	size = input("Small, medium, or large?\n")
	while size.lower() not in possible_sizes:
		size = input("Sorry, we don't have a " + size + " sized pizza! Choose again:\n")
	pickedTopping = topping()
	print("A " + size + " pizza with: " + pickedTopping + ".")
	return "A " + size + " pizza with: " + pickedTopping + "."

def dressing():
	'''
	Takes input from user to select a dressing
	'''
	possible_dressing = ["vinaigrette", "ranch", "blue cheese", "lemon"]
	dressing = input("Choose a dressing: " + ", ".join(possible_dressing) + "\n")
	while dressing.lower() not in possible_dressing:
		dressing = input("Sorry, we don't have " + dressing + "Choose again\n")
	return dressing

def topping():
	'''
	Takes input from user to select toppings for the pizza, no repeat toppings
	'''
	selected_toppings = []
	possible_toppings = ["pepperoni", "mushrooms", "spinach"]
	topping = ""
	while topping.lower() != "done":
		topping = input("Choose a topping: " + ", ".join(possible_toppings) + " or say \"done\"\n")
		if topping == "done":
			continue
		while topping.lower() not in possible_toppings or topping.lower() == "done":
			topping = input("Sorry, we don't have " + topping + " . Choose again. \n")
		while topping.lower() in selected_toppings:
			topping = input("Already on the pizza! Choose again or say \"done\"\n")
		if topping != "done" :
			pass
		selected_toppings.append(topping)
	if not selected_toppings:
		return "nothing on it"
	else:
		return ", ".join(selected_toppings)

# Start of the program
print("Hello!")
select_meal()



