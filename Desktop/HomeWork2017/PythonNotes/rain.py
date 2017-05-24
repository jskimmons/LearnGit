# -*- coding: utf-8 -*-
"""
@author Joe

"""

# Step 1: Prompt user for number of inches

s = input('Please type number of inches\n')
inches = int(s)

# Step 2: Multiply inches with area

sqft_per_acre = 43560
feet = inches / 12
cuft = feet * sqft_per_acre

print("there will be ", cuft, "of rain.")


# Step 3: Convert to output unit(gallons)

gallons_per_cuft = 7.48052
volume = cuft * gallons_per_cuft


# Step 4: Print result

print("There will be ", volume, " gallons of rain.")


