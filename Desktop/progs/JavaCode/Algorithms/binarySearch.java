public class binarySearch{
	public static <T extends Comparable<T>>
		int binary(T[] arr, T findMe){
			high = arr.length;
			low = 0;
			while(low<=high){
				mid = (high + low)/2;
				if(arr[mid].compareTo(findMe) < 0){
					low = mid + 1;
				}
				else if(arr[mid].compareTo(findMe) > 0){
					high = mid - 1;
				}
				else{
					return mid;
				}
			}
			return -1;
		}
	public static void main(String[] args){
		Integer[] a = {0,5,6,8,9,12};
		int index = binarySearch.binary(a, 8);
		System.out.println(index);
	}
}
				


