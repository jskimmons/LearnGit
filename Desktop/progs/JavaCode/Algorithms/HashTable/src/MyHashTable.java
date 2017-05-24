import java.util.LinkedList;

/**
 * Created by JoeSkimmons on 3/28/17.
 */
public class MyHashTable {
    private int SIZE = 13;
    private int HashTable[];
    private LinkedList<Integer> table2[];
    private MyHashTable() {
        HashTable = new int[SIZE];
    }

    public int hash(int element){

        int index = element%SIZE;

        while (HashTable[index]!=0)
            index++;
        return index;
    }
    @Override
    public String toString(){
        String result = "";
        for(int x : HashTable){
            result += x + "->";
        }
        return result;
    }

    public void insert(int element){
        HashTable[hash(element)] = element;
    }

    public static void main(String[] args) {
        MyHashTable hashTest = new MyHashTable();
        hashTest.insert(1);
        System.out.println(hashTest);
        hashTest.insert(27);
        System.out.println(hashTest);
        hashTest.insert(7);
        System.out.println(hashTest);
        hashTest.insert(14);
        System.out.println(hashTest);
        hashTest.insert(14);
        System.out.println(hashTest);
        hashTest.insert(14);
        System.out.println(hashTest);
        hashTest.insert(14);
        System.out.println(hashTest);

    }

}
