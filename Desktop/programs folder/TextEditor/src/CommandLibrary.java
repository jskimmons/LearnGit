import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
/**
 * This class holds all of the methods and algorithms in order to do work
 * on the input given by the user.
 * @author JoeSkimmons, jws2191
 * @version 1.0
 */
public class CommandLibrary{

private FileWriter fw;
private File file;
private LineTool linetool;

	/**
	 * This constructor instantiates a CommandLibrary object which in turn creates a new LineTool object to handle
	 * the output from the methods, because most of them do work on
	 * individual lines.
	 */
	public CommandLibrary(){
		linetool = new LineTool();
	}
	
	/**
	 * This method handles the 'g' command, which opens a new or preexisting file, and writes its 
	 * lines to the lines ArrayList.
	 * @param f file name
	 * @throws IOException
	 */
	public void commandG(String f) throws IOException{
	
		if(f.length()!=0){
			if(!(f.endsWith(".txt"))){
				f = f + ".txt";
			}
		}
		
		file = new File(f);
		if(file.exists()){
			fw = new FileWriter(f, true);
			System.out.println("Previously existing file \n" + "Begin Editing");
		}
		else{
			file.createNewFile();
			fw = new FileWriter(f);
		}
		linetool.readLines(f);
	}
	/**
	 * This method handles the 's' command with a file name, and saves the file to the directory after writing the lines to it from the List lines.
	 * @param f file name given by the user
	 * @throws IOException
	 */
	
	public void commandS(String f) throws IOException{
		if(f.length()!=0){
			if(!(f.endsWith(".txt"))){
				f = f + ".txt";
			}
		}
		
		file = new File(f);
		if(file.exists()){
			fw = new FileWriter(f, true);
			System.out.println("File written, thank you!");
		}
		else{
			file.createNewFile();
			fw = new FileWriter(f);
			System.out.println("File written, thank you!");
		}
		linetool.setLines(fw);	
	}
	
	/**
	 * This method handles the 's' command without a file name and sets 
	 * the lines from the List lines to the file with name given in 'g'.
	 * @throws IOException
	 */
	public void emptyCommandS() throws IOException{
		linetool.setLines(fw);
		fw.close();
		System.out.println("File Written");
	}
	/**
	 * This method handles the 'i' command given by the user and inserts the input into
	 * the List lines, to be written to the file later.
	 * @param t
	 * @throws IOException
	 */
	public void commandI(String t) throws IOException{
		
		linetool.addLine(t + "\n");
	}
	
	/**
	 * This method handles the 'd' command and removes the last line from the List lines
	 * and the file
	 */
	public void commandD(){
		linetool.deleteLastLine();
	}
	
	/**
	 * This handles the 'p' command which prints the arraylist Lines
	 */
	public void commandP(){
		for(int x=0;x<linetool.getArrayList().size();x++){
			System.out.println(linetool.getArrayList().get(x));
		}
	}
	
	/**
	 * This handles the 'c' command which prints the current line from List lines
	 */
	public void commandC(){
		System.out.println(linetool.getArrayList().get(LineTool.currentLine));
	}
	
	/**
	 * This method moves the cursor up one line, and makes sure it doesn't go past the end of the array
	 */
	public void moveUpLine(){
			LineTool.currentLine--;
	}
	/**
	 * This method moves the cursor down a line and makes sure it doesn't go past the end of the array
	 */
	public void moveDownLine(){
			LineTool.currentLine++;
	}
	/**
	 * This handles the 'r' command and replaces the current line with one
	 * of the users choosing
	 * @param r
	 */
	public void commandR(String r) {
		linetool.getArrayList().set(LineTool.currentLine, r);
	}
	/**
	 * This command ends the program if 'q' is called.
	 */
	public void commandQ() {
		System.out.println("Goodbye");
		Editor.endEditor = true;
	}
}