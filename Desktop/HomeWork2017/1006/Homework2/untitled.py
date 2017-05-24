'''
This is a basic dialog system that prompts the user to
order pizza

@author Joe Skimmons, jws2191

'''

def select_meal():
    possible_orders = ["pizza" , "pasta" , "salad"]
    meal = input("Hello, would you like pizza, pasta, or salad?\n")
    while meal.lower() not in possible_orders:
    	meal = input("Sorry, we don't have " + meal + " today!\n")

def salad():
	salad = input("Hello, would you like pizza, pasta, or salad?\n")
	while salad.lower() != "salad":
    	salad = input("Sorry, we don't have " + meal + " today!\n")

select_meal()
salad()