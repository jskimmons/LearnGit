object ImmutableQueue {

    def reverse[T](l : List[T]) : List[T] = {
        if(l == Nil){
            return Nil; 
        } else{
            val tmp = l.tail
            return reverse(tmp) ::: l.head :: Nil
        }
    }


    def printAll(new_q : ImmutableQueue[Int]) : Unit  = {
      
        try {
            val (element, remaining_q) = new_q.dequeue;       
            print(element+" ");
            printAll(remaining_q);
        } catch {
            case ex: RuntimeException => Unit;
        }
    }

    def main(args : Array[String]) = {

        val q = new ImmutableQueue[Int](); 

        val new_q = q.enqueue(1).enqueue(2).enqueue(3).enqueue(4).enqueue(5);
       
        printAll(new_q);
        print("\n") 
        
    }

}

class ImmutableQueue[T] (val in : List[T] = Nil, val out : List[T] = Nil) { 

    def enqueue(x : T) : ImmutableQueue[T] = {
        return new ImmutableQueue[T](x :: in ::: Nil, out);
    }

    def dequeue : (T, ImmutableQueue[T]) = { 
        if(in.size == 0 && out.size == 0){
            throw new NoSuchElementException("Queue is empty");
        }
        else if(in.size != 0 && out.size == 0){
            val revOut = ImmutableQueue.reverse(in);
            val removed = revOut.head;
            val newOut = revOut.tail;
            val newIn : List[T] = Nil;
            return (removed, new ImmutableQueue(newIn, newOut));
        }
        else{
            val removed = out.head;
            val newOut = out.tail;
            return (removed, new ImmutableQueue(in, newOut));
        }
    }

}

