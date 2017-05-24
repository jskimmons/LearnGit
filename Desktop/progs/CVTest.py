import numpy as np
import cv2
from matplotlib import pyplot as plt

# Load an color image in grayscale
img = cv2.imread('bloons.jpg',1)
img2 = img[:,:,::-1]

# define the list of boundaries
boundaries = [
	([100, 0, 0], [255, 100, 100])
]

# loop over the boundaries
for (lower, upper) in boundaries:
	# create NumPy arrays from the boundaries
	lower = np.array(lower, dtype = "uint8")
	upper = np.array(upper, dtype = "uint8")
 
	# find the colors within the specified boundaries and apply
	# the mask
	mask = cv2.inRange(img2, lower, upper)
	output = cv2.bitwise_and(img2, img2, mask = mask)
 
	# show the images
	plt.imshow(np.hstack([img2, output]), cmap = 'gray', interpolation = 'bicubic')
	plt.xticks([]), plt.yticks([])  # to hide tick values on X and Y axis
	plt.show()