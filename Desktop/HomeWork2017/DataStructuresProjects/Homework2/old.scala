if(in.size == 0 && out.size == 0){
            throw new NoSuchElementException("Queue is empty");
        }
        else if(in.size != 0 && out.size == 0){
            val revIn = ImmutableQueue.reverse(in);
            val removed = revIn.head;
            val newOut = revIn.tail;
            val emptyIn : List[T] = Nil;
            return (removed, new ImmutableQueue(emptyIn, newOut));
        }
        else{
            val removed = out.head;
            val newOut = out.tail;
            return (removed, new ImmutableQueue(in, newOut));
        }