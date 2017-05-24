object Reverse{
	def reverse[T](l : List[T]) : List[T] = {
        if(l == Nil){
            return Nil; 
        } else{
            val tmp = l.tail
            return reverse(tmp) ::: l.head :: Nil
        }
    }

    def main(args : Array[String]) = {

        val l = 1::2::3::4::5::Nil;
        println(reverse(l));
        
    }
}