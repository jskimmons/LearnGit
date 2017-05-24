import java.io.IOException;

public class TSVPipeline_tester {
	
	public static void main(String [ ] args) throws IOException{
		
		TSVFilter filter = new TSVFilter.FilterBuilder()
				.select()
				.whichFile("Test.txt")
				.compute("Age", Command.MAX)
				.range()
				.build();
		
		new TSVPipeline(filter).doIt();
	}
}
