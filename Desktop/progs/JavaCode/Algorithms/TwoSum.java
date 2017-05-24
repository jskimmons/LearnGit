import java.util.HashMap;

public class TwoSum {
	
	public static void main(String[] args) {
		int[] numbers = {1, 3, 5, 6};
		int target = 6;
		HashMap<Integer, Integer> testMap = new HashMap<>();
		int[] result = new int[2];
		
		for(int i=0; i < numbers.length; i++){
			if (testMap.containsKey(numbers[i])) {
				int index = testMap.get(numbers[i]);
					result[0] = index;
					result[1] = i;
					break;
			} else{
				testMap.put(target - numbers[i], i);
			}
		}
		for(int i=0; i<result.length;i++)
			System.out.println(result[i]);
	}
}

