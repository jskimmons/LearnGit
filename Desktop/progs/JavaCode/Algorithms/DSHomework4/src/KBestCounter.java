import java.util.*;

public class KBestCounter<T extends Comparable<? super T>> {

    PriorityQueue<T> heap;
    int k;
    ArrayList<T> arrayList;

    public KBestCounter(int k) {
        heap = new PriorityQueue<T>(k);
        this.k = k;
    }

    public void count(T x) {
        if (heap.size() != k) {
            heap.add(x);
        }
        else if (x.compareTo(heap.peek()) >= 0){
            heap.remove(heap.peek());
            heap.add(x);
        }
    }

//    public List<T> kbest() {
//        arrayList =  new ArrayList<T>();
//        for (T element : heap){
//            arrayList.add(element);
//        }
//        Comparator<Long> comparator = Collections.reverseOrder();
//        Collections.sort(arrayList, (Comparator<? super T>) comparator);
//        return arrayList;
//
//    }

    public List<T> kbest() {
        arrayList =  new ArrayList<T>();
        for (T element : heap){
            arrayList.add(element);
        }
        Comparator<T> comparator = Collections.reverseOrder();
        Collections.sort(arrayList, comparator);
        return arrayList;

    }

}