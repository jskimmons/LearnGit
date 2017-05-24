import java.io.IOException;

/**
 * This system is a text editor that works with user inputed commands and strings to write 
 * to chosen files.
 * The contained classes are:
 * Editor: starts the text editor and creates a commandManager object to manage the inputed commands and strings.
 * Talker: takes input from the user and splits it into commands and Input
 * CommandManager: creates CommandLibrary object, decides which method from that class to call depending on the user input
 * CommandLibrary: holds methods for each command, and their algorithms.
 * LineTool: creates an ArrayList lines (data structure choice explained in class) that holds all input and reads from 
 * pre-existing files and outputs to write files.
 * @author JoeSkimmons, jws2191
 * @version 1.0
 */

public class HW2_Runner {

	public static void main(String[] args) throws IOException {
	
	Editor text = new Editor();
	text.runEditor();

	}
}
