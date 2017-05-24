import java.util.LinkedList;
import java.util.List;

/**
 * Created by JoeSkimmons on 2/11/17.
 */
public class LinkedListStack<T> implements Stack<T> {

    List<T> list;

    public LinkedListStack(){
        list = new LinkedList<T>();
    }

    @Override
    public void push(T x) {
        list.add(list.size(), x);
    }

    @Override
    public T pop() {
        if(top() != null) {
            return list.remove(list.size() - 1);
        }
        else{
            System.err.println("Stack is empty, cannot be popped");
            return null;
        }
    }

    @Override
    public T top() {
        if(list.size() == 0)
            return null;
        else
            return list.get(list.size()-1);
    }

    public boolean empty(){
        return list.isEmpty();
    }

    public int size() {
        return list.size();
    }
}
