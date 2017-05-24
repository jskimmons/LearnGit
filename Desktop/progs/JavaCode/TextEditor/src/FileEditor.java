public class FileEditor{

	private Command current = null;
	private FileManager fm;
	private Talker talker;

	public FileEditor(Talker t) {
		this.talker = new Talker();
	}

	public void start(){
		talker.printGreeting();

		while(current.getCommand() != "q") {
			switch(current.getCommand()) {
			case "g": loadFile(current); break;
			case "p": fm.printEntireFile(); break;
			case "c": System.out.println(fm.getCurrentLine()); break;
			case "i": fm.insertLine(current.getArg()); break;
			case "r": fm.insertLine(current.getArg());break;
			case "d": fm.deleteLine(); break;
			case "^": fm.moveCursorUp(); break;
			case "v": fm.moveCursorDown(); break;
			case "s": saveFile(current); break;
			case "q": talker.printGoodbye(); break;
			}
		}
	}

	private void loadFile(Command command) {
		this.fm = new FileManager();
		/*if(command.getArgs().length() == 0)
		*	this.fm.createFile(DEFAULT_FILENAME);
		*/
		//else 
			this.fm.loadFile(command.getArg());
	}

	private void saveFile(Command command) {
		//if(command.getArgs().length() == 0)
			//this.fm.saveFile();
		//else
		this.fm.saveFile(command.getArg());
		talker.printSaveGoodbye(command.getArg() + ".txt");
	}
}



