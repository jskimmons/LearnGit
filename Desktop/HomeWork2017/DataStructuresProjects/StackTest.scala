class Stack[T](){
    /**
    * Stack to use in part (a)
    **/
    var stackList : List[T] = Nil

    def push(elem: T) = {
        stackList = elem ::: stackList :: Nil
        stackList
    }

    def pop() = {
        val result : T = stackList.head
        stackList = stackList.tail
        stackList
    }
}
object StackTest {
    def main(args : Array[String]) {
        var stack : Stack[Int] = new Stack[Int]()
    }
}