import java.io.IOException;
/**
 * This class creates a text editor object
 * @author JoeSkimmons, jws2191
 *
 */
public class Editor {

	private CommandManager manager;
	static boolean endEditor;
	
	/**
	 * The constructor creates a commandManager object and sets the ednEditor field to false, which when true
	 * will end the editor.
	 * @throws IOException
	 */
	public Editor() throws IOException{
		endEditor = false;
		System.out.println("Start Editing");
		manager = new CommandManager();
	}
	
	/**
	 * This method runs the text editor by calling the manager object.
	 * @throws IOException
	 */
	public void runEditor() throws IOException{
		while(endEditor == false){
			
			manager.callCommand();
			
		}
		
	}
		
}

