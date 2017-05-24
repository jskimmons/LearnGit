import java.io.IOException;

/**
 * This class handles the input passed to it from the talker class. 
 * @author JoeSkimmons, jws2191
 *
 */

public class CommandManager {

	private CommandLibrary library;
	private Talker talker;
	
	/**
	 * Constructs an object that instantiates a talker object (to draw input from) and a commandLibrary (to give input to)
	 * @throws IOException
	 */
	
	public CommandManager() throws IOException{
		talker = new Talker();
		library = new CommandLibrary();
	}
	
	/**
	 * This method uses the two strings given to it by the talker class to call the correct method with the
	 * correct input from CommandLibrary. Has an 'empty' commandS and commandG method to handle if the file name is given
	 * at the beginning or the end of the editor's lifetime.
	 * @throws IOException
	 */
	public void callCommand() throws IOException{
		
		talker.setSubstrings();

		if((talker.getCommand()).equals("g")&&!(talker.getUserInput().length()==1)){
			library.commandG(talker.getsInputString());
		}
		if((talker.getCommand()).equals("s")&&(talker.getUserInput().length()==1)){
			library.emptyCommandS();
		}
		if((talker.getCommand()).equals("s")&&!(talker.getUserInput().length()==1)){
			library.commandS(talker.getsInputString());
		}
		if((talker.getCommand()).equals("i")){
			library.commandI(talker.getsInputString());
		}
		if((talker.getCommand()).equals("p")){
			library.commandP();
		}
		if((talker.getCommand()).equals("d")){
			library.commandD();
		}
		if((talker.getCommand()).equals("^")){
			library.moveUpLine();
		}
		if((talker.getCommand()).equals("v")){
			library.moveDownLine();
		}
		if((talker.getCommand()).equals("r")){
			library.commandR(talker.getsInputString());
		}
		if((talker.getCommand()).equals("c")){
			library.commandC();
		}
		if((talker.getCommand()).equals("q")){
			library.commandQ();
		}
	}
}