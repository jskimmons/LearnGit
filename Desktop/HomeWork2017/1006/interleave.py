
def interleave(list_a, list_b):
	results = []
	results_len = len(list_a) + len(list_b)
	count = 0
	x = 0

	while count < results_len:
		if x < len(list_a):
			results.append(list_a[x])
			count += 1
		if x < len(list_b):
			results.append(list_b[x])
			count += 1
		x+=1
	return results

a = [0,1,2]
b = ["a", "b", "c", "d"]

print(interleave(a,b))