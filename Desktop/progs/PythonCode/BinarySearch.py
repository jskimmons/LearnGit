'''
This is an implementation of the binary search algorithm
'''

def binarySearch(li, target):
    front = 0
    end = len(li) - 1 
    found = False
    answer = 0
    while front <= end and not found:
        mid = (front + end)//2
        if not li[mid] == target:
            if li[mid] < target:
                front = mid + 1
            if li[mid] > target:
                end = mid - 1
        else:
            answer = mid
            found = True
    return answer

li = [0,2,4,6,8]
result = binarySearch(li, 0)
print(result)
