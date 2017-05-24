/** 
 * A simple binary tree that stores strings. 
 * This is an abstract base class for the concrete classes Node and Leaf.
 */
abstract class ExpressionTree { 
 
    val content : String

    // methods for parts (b), (c), and (d)
    def postfix() : String = {
      def proc_leaf(content : String) : String = content;
      
      def proc_node(left: String, right: String, content: String) : String = 
        left + right + content;
      
      traverse[String](proc_node, proc_leaf);
    }
    def infix() : String =  {
      def proc_leaf(content : String) : String = content;
      
      def proc_node(left: String, right: String, content: String) : String =
        "(" + left + content + right + ")";
      
      traverse[String](proc_node, proc_leaf)
    }  
    def eval() : Double = {
      def proc_leaf(content : String) : Double = content.toDouble;

      def proc_node(left: Double, right: Double, content: String) : Double = {
        return content match {
          case "+"  => left + right;
          case "-"  => left - right;
          case "/"  => left / right;
          case "*"  => left * right;
          case  _   => throw new IllegalArgumentException("Operator is not defined") 
        }
      }
      traverse[Double](proc_node, proc_leaf);
    }

    /** 
     * A higher-order generalization for tree operations.
     *                   
     * This method implements tree traversal as an 
     * abstraction over different tree operations.
     * Tree operations can be implemented by creating function objects
     * proc_node and proc_leaf and passing them to traverse.
     * The abstract method is implemented in Node and Leaf. 
     */                     
    def traverse[A](proc_node: (A,A,String) => A, proc_leaf: String=>A) : A 

}

object ExpressionTree {

    val operand : List[String] = List("*", "/", "+", "-")
    // method for part (a)
    def apply(expression : String) : ExpressionTree =  {
        val stack : Stack[ExpressionTree] = new Stack[ExpressionTree]()
        val expression_Array = expression.split(" ")
        for( x <- 0 to expression_Array.size-1) {
            if(operand.contains(expression_Array(x))){
                val right = stack.pop();
                val left = stack.pop();
                stack.push(Node(expression_Array(x), left, right));
            }
            else{
                stack.push(Leaf(expression_Array(x)));
            }
        }
        stack.pop();
    }


    // You can run ExpressionTree to test your code.
    def main(args : Array[String]) {

        // Uncomment to test part (a)
        val tree : ExpressionTree = ExpressionTree("3 5 6 * + 7 -");
            
        // Uncomment to test part (b)
        println(tree.postfix())    


        // Uncomment to test part (c)
        println(tree.infix())    
    
        // Uncomment to test part(d) 
        println(tree.eval())
    }


}

/** 
 * A node with exactly two subtrees. 
 */ 
class Node(val content: String, val left: ExpressionTree, val right: ExpressionTree) extends ExpressionTree {

     /** 
      * The traverse implementation for Node calls proc_node on the 
      * results returned by calling traverse recusively on each 
      * subtree and the content of this node. 
      */
    def traverse[A](proc_node : (A,A,String) =>A, proc_leaf: String=>A) = 
            proc_node(left.traverse(proc_node, proc_leaf), 
                     right.traverse(proc_node, proc_leaf),
                     content)
}

/** Companion object for Node -- only used to define an apply method */
object Node {
    def apply(content: String, left : ExpressionTree, right: ExpressionTree) = 
        new Node(content, left, right)
}


/** 
 * A node that does not have any further subtrees (i.e. a single leaf node).
 */
class Leaf(val content : String) extends ExpressionTree {
    /** 
     * The traverse implementation for Leaf calls proc_laf on the content of
     * the node. proc_leaf usually just converts the content into the correct
     * result type.
     */
    def traverse[A](proc_node : (A,A,String)=>A, proc_leaf: String=>A) =
        proc_leaf(content) 
}
/**  
 * Companion object for the Leaf, only used to define an apply method 
 */
object Leaf {
    def apply(content: String) = new Leaf(content) 
}    

class Stack[T](){
    /**
    * Stack to use in part (a)
    **/
    var stackList : List[T] = Nil

    def push(elem: T) = {
        stackList = elem :: stackList ::: Nil
        stackList
    }

    def pop() = {
        val result : T = stackList.head
        stackList = stackList.tail
        result
    }
}    

