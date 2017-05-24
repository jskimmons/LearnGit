import java.util.ArrayList;

/**
 * Created by JoeSkimmons on 1/30/17.
 */

public class ArrayDuplicates {
    // Given array, find its duplicates

    public ArrayList<Integer> findDuplicates(int [] arr) {

        ArrayList<Integer> Al = new ArrayList<>();
        for (int i = 0; i < arr.length; i++) {
            if(arr[Math.abs(arr[i])] > 0)
                arr[Math.abs(arr[i])] *= -1;
            else if(arr[Math.abs(arr[i])] < 0)
                Al.add(Math.abs(arr[i]));
        }
        return Al;
    }

    public static void main(String[] args) {
        ArrayDuplicates test = new ArrayDuplicates();
        int [] arr = {1, 1, 3, 3, 4, 2, 5, 6, 7, 4, 2};
        System.out.println(test.findDuplicates(arr));
    }
}
