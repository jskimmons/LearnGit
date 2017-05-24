import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;

/**
 * This class creates LineTool objects that are able to keep track of what
 * line of text the user is currently on, encoded using the dictionary class.
 * @author JoeSkimmons, jws2191
 * @version 1.0
 *
 */

public class LineTool {
	
private Scanner s;
private ArrayList<String> lines;
static int currentLine;
	
/**
 * This constructor instantiates a new LineTool object that 
 * contains an ArrayList keeping track of each compressed string.
 * I chose to use an ArrayList because of the ease of 
 * adding strings to it, and the ability to change lines and remove them,
 * while keeping a floating index of all Strings.
 */

	public LineTool(){
		lines = new ArrayList<String>();
	}
	
	/**
	 * This method adds a new line to the ArrayList and updates the currentLine variable
	 * @param l is the string to be added to the line
	 */
	public void addLine(String l){
		lines.add(l);
		currentLine = lines.size()-1;
	}
	
	/**
	 * @return the ArrayList of Strings corresponding to each line
	 */
	public ArrayList<String> getArrayList(){
		return lines;
	}
	
	/**
	 * This method reads the lines from an existing file specified by the user
	 * into the ArrayList lines.
	 * @param f the file name to be printed to
	 * @throws FileNotFoundException
	 */
	
	public void readLines(String f) throws FileNotFoundException{
		s = new Scanner(new File(f));
		while (s.hasNextLine()){
		    this.addLine(s.nextLine());
		}
		s.close();
		currentLine = lines.size()-1;
	}
	
	/**
	 * This method sets the lines contained in the ArrayList of lines
	 * into a file, specified by the FileWriter
	 * This method is useful in the "p" command.
	 * @param writer FileWriter for the file that the user is reading lines from.
	 * @throws IOException
	 */
	public void setLines(FileWriter writer) throws IOException{
		
		for(String str: lines) {
			  writer.write(str +  "\n");
			}
	}
	
	/**
	 * This method removes the current line from lines.
	 */
	public void deleteLastLine(){
		lines.remove(currentLine);
		currentLine = lines.size()-1;
	}
	
	/**
	 * This method returns the currentLine
	 * @return currentLine, an integer indicating the index of the current line in lines.
	 */
	public int getCurrentLine() {
		return currentLine;
	}
}
