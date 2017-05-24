object test {

    def testQueue = {
        val q = new ImmutableQueue[Int](); 
        val new_q = q.enqueue(1).enqueue(2).enqueue(3).enqueue(4).enqueue(5);
        ImmutableQueue.printAll(new_q);
        print("\n");
    }

    def main(args : Array[String]) = {
        val q = new ImmutableQueue[Int]();
        val new_q = q.enqueue(1).enqueue(2).enqueue(3);
        val (element1, remaining_q1) = new_q.dequeue;
        val (element2, remaining_q2) = remaining_q1.dequeue;
        val (element3, remaining_q3) = remaining_q2.dequeue;
        print(remaining_q2.in);
    }
}
