object TestImmutableQueue {

    def testReverse = {
        val l : List[Int] = List(1,2,3,4,5);
        println(ImmutableQueue.reverse(l));
    }

    def testQueue = {
        val q = new ImmutableQueue[Int](); 
        val new_q = q.enqueue(1).enqueue(2).enqueue(3).enqueue(4).enqueue(5);
        ImmutableQueue.printAll(new_q);
        print("\n");
    }

    def main(args : Array[String]) = {
        println("Testing reverse. Should print List(5,4,3,2,1): ");
        testReverse;
        println("Testing queue. Should print 1 2 3 4 5: ");
        testQueue;
    }
}
