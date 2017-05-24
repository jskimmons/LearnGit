object Hanoi { 
  
  def move(n : Int, source: String, target : String, tmp : String) : Int = {
    
    if(n==1) {
      println("Move " + source + " to " + target);
      1;
    } else {

      val t1 = move(n-1, source, tmp, target);
      println("Move " + source + " to " + target);
      val t2 = move(n-1, tmp, target, source);
      t1 + t2 + 1;

    }

  }

  def main(args : Array[String]) = {
    print("total number of steps" + move(3, "A", "C", "B"));

  }
}
