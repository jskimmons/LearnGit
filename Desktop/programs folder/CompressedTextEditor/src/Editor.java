import java.io.IOException;

public class Editor {

	private CommandManager manager;
	static boolean endEditor;
	
	public Editor() throws IOException{
		endEditor = false;
		System.out.println("Start Editing");
		manager = new CommandManager();
	}
	
	public void runEditor() throws IOException{
		int x = 0;
		while(endEditor == false){
			
			manager.callCommand();
			
		}
		
	}
		
}

