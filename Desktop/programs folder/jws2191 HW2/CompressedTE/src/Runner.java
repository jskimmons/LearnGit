import java.io.IOException;

/**
 * This project creates .cmp files containing integers which pertain to a dictionary key at the top of the file.
 * It has the classes:
 * Editor: starts the text editor and creates a commandManager object to manage the inputed commands and strings.
 * Talker: takes input from the user and splits it into commands and Input
 * CommandManager: creates CommandLibrary object, decides which method from that class to call depending on the user input
 * CommandLibrary: holds methods for each command, and their algorithms.
 * LineTool: creates an ArrayList lines (data structure choice explained in class) that holds all input and reads from 
 * pre-existing files and outputs to write files.
 * Dictionary: holds a dictionary ArrayList and converts input into its indicies of the dictionary when inputed, and then back when printing.
 * @author JoeSkimmons, jws2191
 * @version 1.0
 *
 */
public class Runner {

	public static void main(String[] args) throws IOException {
	
	Editor editor = new Editor();
	editor.runEditor();
	
	}

}
