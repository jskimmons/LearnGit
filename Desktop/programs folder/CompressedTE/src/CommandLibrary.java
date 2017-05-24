import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Scanner;
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
private Dictionary dictionary;
private String newLine;
private Scanner s;

/**
 * This constructor instantiates a CommandLibrary object which in turn creates a new LineTool object to handle
 * the output from the methods, and a dictionary object to handle conversions to indices
 */

	public CommandLibrary() throws IOException{
		linetool = new LineTool();
		dictionary = new Dictionary();
	}
	
	/**
	 * This method handles the 'g' command, which opens a new or pre-existing file, and writes its 
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
	 * It also writes the dictionary to the top of the class.
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
			fw = new FileWriter(f, true);
			System.out.println("File written, thank you!");
		}
		linetool.setLines(fw);	
		dictionary.setLines(fw);
	}
	
	/**
	 * This method handles the 's' command without a file name and sets 
	 * the lines from the List lines to the file with name given in 'g'. 
	 * Also writes the dictionary to the top of the file
	 * @throws IOException
	 */
	public void emptyCommandS() throws IOException{
		
		dictionary.setLines(fw);
		linetool.setLines(fw);
		System.out.println("File written, thank you!");
	}
	
	/**
	 * This method handles the 'i' command given by the user and adds it to the dictionary and converts it to 
	 * the indices, also inserts the input into
	 * the List lines, to be written to the file later.
	 * @param t
	 * @throws IOException
	 */
	public void commandI(String t) throws IOException{
			dictionary.addToDictionary(t);
			newLine = "";
			dictionary.convertToIndices(t);
			
			for(int x=0;x<dictionary.getIndices().size();x++){
				newLine = newLine + dictionary.getIndices().get(x) + " ";
			}
			dictionary.clearIndices();
			linetool.addLine(newLine + "\n");
			
	}
	
	/**
	 * This method handles the 'd' command and removes the last line from the List lines
	 * and the file
	 */
	public void commandD(){
		linetool.deleteLastLine();
	}
	/**
	 * This handles the 'p' command which prints the ArrayList Lines. First converts the indices back into text.	
	 * @throws FileNotFoundException 
	 */
	public void commandP() throws FileNotFoundException{
		String l = "";
		String d = "";
		String p = "";
		s = new Scanner(file);
		l = s.nextLine();
		s = new Scanner(l);
		while(s.hasNext()){
			Dictionary.dictionaryList.add(s.next());
		}
		
		while(s.hasNextInt()){
			p = p + s.nextInt();
			Dictionary.dictionaryList.add(dictionary.convertIndicesBack(p));
		}
		for(int x=0;x<linetool.getArrayList().size();x++){	
			System.out.println(dictionary.convertIndicesBack(linetool.getArrayList().get(x)));
		}
	}
	
	/**
	 * This handles the 'c' command which prints the current line from List lines after de-compressing the file
	 */
	public void commandC(){
		dictionary.convertIndicesBack(linetool.getArrayList().get(LineTool.currentLine-2));
		System.out.println(dictionary.getStringBack().get(LineTool.currentLine-2));
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
	public void commandR(String r) throws IOException {
		dictionary.addToDictionary(r);
		newLine = "";
		dictionary.convertToIndices(r);
		
		for(int x=0;x<dictionary.getIndices().size();x++){
			newLine = newLine + dictionary.getIndices().get(x) + " ";
		}
		dictionary.clearIndices();
		linetool.getArrayList().set(LineTool.currentLine, r);
		linetool.setLines(fw);
	}
	/**
	 * Ends the text editor
	 */
	public void commandQ() {
		Editor.endEditor = true;
		System.out.println("GoodBye");
	}
}