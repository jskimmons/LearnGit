class Rational(n:Int,d:Int){
  val num = n
  val den = d

  override def toString = n + "/" + d
  def +(other:Rational) = {
    val new_num = this.num * other.den + other.num * this.den
    val new_den = this.den * other.den
    new Rational(new_num, new_den)
  }
}

object Rational{
  def main(args: Array[String]){
    val someNumber = new Rational(1,2) + new Rational(2,3) 
    println(someNumber)
  }
}
