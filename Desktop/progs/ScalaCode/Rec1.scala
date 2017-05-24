
def square(x:Int) :Int = x*x

val a :Int=>Int = square

def doComputation(x:Int, y:Int=>Int) = y(x)

println(doComputation(5,a))