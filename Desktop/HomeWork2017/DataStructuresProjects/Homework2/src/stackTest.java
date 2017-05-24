/**
 * Created by JoeSkimmons on 2/11/17.
 */
public class stackTest {
    public static void main(String[] args) {
        LinkedListStack<Integer> stack = new LinkedListStack<>();
        stack.push(20);
        stack.push(30);
        stack.push(2);
        System.out.println(stack.top());
        stack.pop();
        System.out.println(stack.top());
        stack.pop();
    }
}
