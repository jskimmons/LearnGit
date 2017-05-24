import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Scanner;

/**
 * Class that pipes information from a given file
 * into a given output file.
 * @author JoeSkimmons, jws2191
 *
 */
public class TSVPipeline {

	private Scanner initialRead;
	private Scanner headerRead;
	private Scanner typeRead;
	static ArrayList<String> headerLine = new ArrayList<String>();
	static ArrayList<String> typeLine = new ArrayList<String>();
	static int type[];
	private FileReader fr;
	private BufferedReader br;
	private FileWriter fw;
	private BufferedWriter bw;
	private String firstLine;
	private String secondLine;
	private Scanner streamRead;
	private PrintWriter out;
	private TSVFilter filter;
	private CommandLibrary library;
	private TSVHelper helper;
	
	/**
	 * This constructor takes in a filter object containing info to be used in
	 * the piping of data
	 * @param filter
	 * @exception IOException is caught if a given file name does not exist
	 */
	public TSVPipeline(TSVFilter filter, TSVHelper helper){
	
		this.helper = helper;
		this.filter = filter;
		library = new CommandLibrary();
		
		try {
			fw = new FileWriter("TestOutput.txt", true);
			bw = new BufferedWriter(fw);
			out = new PrintWriter(bw);
		} catch (IOException e) {
			System.out.println("Writable file does not exist");
		}
		try {
			fr = new FileReader(filter.getFileName());
			br = new BufferedReader(fr);
		} catch (FileNotFoundException e) {
			
			System.out.println("File not found!");
		}
		
		initialRead = new Scanner(br);
	}
	
	/**
	 * Method that reads the first two lines from the file.
	 * The first is the header, and it put into a headerLine ArrayList. I used
	 * and ArrayList because of the ease of adding elements, and the unknown of how many
	 * header elements there are in a file. The second line defines each type, put into a type array (because the size
	 * is the same as the header and therefore known) represented by a 1 (String) or 0 (Long)
	 * @throws IOException
	 */
	public void readFirstTwoLines() throws IOException{
		
		if(initialRead.hasNextLine()){
			firstLine = initialRead.nextLine();
			headerRead = new Scanner(firstLine);
		}
		
		while(headerRead.hasNext()){
			headerLine.add(headerRead.next());
		}
		
		if(initialRead.hasNextLine()){
			secondLine = initialRead.nextLine();
			typeRead = new Scanner(secondLine);
		}
		
		while(typeRead.hasNext()){
			typeLine.add(typeRead.next());
		}
	}

	/**
	 * Writes each acceptable line into the out-file.
	 * @throws IOException if file does not exist
	 */
	public void writeTSV() throws IOException{
		
		out.println(firstLine + "\t");
		if(helper.containsCondition(secondLine)&&helper.inRange(secondLine)){
			try{
			library.setUpCommand(filter.getComputeType(), filter.getCommandType(), secondLine);
			out.println(secondLine+"\t");
			}
			catch(NullPointerException e){
				out.println(secondLine+"\t");
			}
		}
		
		while(initialRead.hasNextLine()){
			String nextLine = initialRead.nextLine();
			
			if(helper.isLineFormatted(nextLine)&&helper.containsCondition(nextLine)){
				if(helper.inRange(nextLine)){
				try{
					library.setUpCommand(filter.getComputeType(), filter.getCommandType(), nextLine);
					out.println(nextLine+"\t");
					}
					catch(NullPointerException f){
						out.println(nextLine+"\t");
					}
				}
			}
		}
	}
	
	/**
	 * Closes all file writers, buffered writers, and print writers
	 * @throws IOException if files do not exist
	 */
	public void closeWriter() throws IOException{
		bw.close();
		fw.close();
		br.close();
		fr.close();
		out.close();
	}	
	
	/**
	 * 
	 * @return headerLine arrayList containing each header element from first line
	 */
	public ArrayList<String> getHead(){
		return headerLine;
	}
	
	/**
	 * 
	 * @return type array containing each type element
	 */
	public int[] getType(){
		return type;
	}

	/**
	 * runs each method given the information from the filter object
	 * @throws IOException if out-file doesn't exist to write to, or in-file to receive data from
	 * @exception NullPointerException caught if command results cannot be written
	 */
	public void doIt() throws IOException{
		this.readFirstTwoLines();
		helper.determineTypes();
		this.writeTSV();
		this.closeWriter();
		try{
			library.printVals(filter.getCommandType());
		}
		catch(NullPointerException g){
		}
	}

}
