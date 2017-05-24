import java.io.IOException;

/**
 * This program tells if a TSV file is correctly formatted, depending on the first line (header)
 * and the second line (types).
 * Classes:
 * TSVFilter - uses the builder pattern to create a Filter object that can filter the TSV file
 * depending on the attributes passed by the user. It can select any item from the header column to filter by,
 * return a range of results, or compute values of the file.
 * TSVHelper - helper class that contains methods in order to check proper format, and 
 * if lines satisfy range, select, or compute conditions.
 * Command - enum that holds the acceptable Commands to be passed to the compute method
 * CommadLibrary - holds the logic and data for each possible command, to be printed to
 * the console.
 * TSVPipeline - pipes the correctly formatted lines to the output file.
 * @author JoeSkimmons, jws2191
 *
 */
public class HW3_Runner {
	
	public static void main(String [ ] args) throws IOException{
		
		TSVFilter filter = new TSVFilter.FilterBuilder()
				.select()
				.whichFile("Test.txt")
				.compute("Age", Command.AVG)
				.range()
				.build();
		TSVHelper helper = new TSVHelper(filter);
		new TSVPipeline(filter, helper).doIt();
	}
}