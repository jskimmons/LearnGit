class fib(){
	def fib(n: Int) : Long = {
		if(n==1 || n==2) return 1;
		var t1 : Long = 1;
		var t2 : Long = 1;
		var next : Long = 0;
		for( x <- 3 to n+1) {
			next = t1+t2;
			t2 = t1;
			t1 = next;
		}
		next;
	}
	def apply() : fib = new fib();
}

object fib {
	def main(args: Array[String]): Unit = {
		val fib = new fib();
		println(fib.fib(3));
	}
}