''' This program will, given an integer representing a number of years, 
print the approximate population given the current population and the 
approximate births, deaths, and immigrants per second. '''

# Step 1: store the current population and calculate the rates of births, 
# deaths, and immigrations per year

current_population = 307357870
births_per_year = (60*60*24*365)/7
deaths_per_year = (60*60*24*365)/13
immigrants_per_year = (60*60*24*365)/35

#Step 2: take in number of years as input 

s = input('Enter how many years into the future you would like to see the population?: ')
years = int(s)

# Step 3: adjust the population accordingly

new_population = current_population + years*(births_per_year - deaths_per_year + immigrants_per_year)
print("The new population is %d people." % new_population)