import java.io.IOException;

public class CommandManager {

	private CommandLibrary library;
	private Talker talker;
	
	public CommandManager() throws IOException{
		talker = new Talker();
		library = new CommandLibrary();
	}
	
	public void callCommand() throws IOException{
		
		talker.setSubstrings();
		
		if((talker.getCommand()).equals("g")&&(talker.getUserInput().length()==1)){
			library.emptyCommandG();
		}
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