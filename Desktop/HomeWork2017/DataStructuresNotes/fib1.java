public class fib1 {
	
	public static long fib(long n){
	
		long km1 = 1;
		long km2 = 1;
	
		if(n==1)
			return 1;
		else if (n==2)
			return 1;
		
		for(int k=3; k<=n; k++) {
			long next = km1 + km2;
			km2 = km1;
			km1 = next;
		}
		return km1;
	}
	
	
	public static void main(String[] args) {
		int n = Integer.parseInt(args[0]);

		long fib_number = fib(n);

		System.out.printf("The %d-th fibonaci number is %d ", n, fib_number);

	}
}
