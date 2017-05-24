
public class TSVFilter_Tester {

	public static void main(String[] args) {
		
		TSVFilter filter = new TSVFilter.FilterBuilder()
										.select()
										.whichFile("test.txt")
										.build();
		
		System.out.println(filter);
		
	}

}
