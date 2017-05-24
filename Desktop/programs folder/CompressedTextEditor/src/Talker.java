import java.util.Scanner;

public class Talker {	
	
private String sInputString;
private String userInput;
private String command;
private boolean commandContained;
	public Talker(){
	}
	
	public void setSubstrings(){
		Scanner s = new Scanner(System.in);
		System.out.print("> ");
		userInput = s.nextLine();
		
		if(userInput.length()==0){
			System.out.println("Please enter a command");
			this.setSubstrings();
		}
		
		if(userInput.length()==1){
			command = userInput;
			sInputString = "";
		}
		
		else{
			command = userInput.substring(0,1);
			sInputString = userInput.substring(2);
		}
		
		/*commandContained = false;
		for(int x=0;x<CommandLibrary.POSSIBLE_COMMANDS.length;x++){
			if(command==CommandLibrary.POSSIBLE_COMMANDS[x]){
				commandContained = true;
			}
		}
		if(commandContained==false){
			System.out.println("Please begin your input with a command");
			this.setSubstrings();
		}
		*/
	}
	
	
	public String getCommand(){
		return command;
	}

	public String getsInputString(){
		return sInputString;
	}
	
	public String getUserInput(){
		return userInput;
	}

}
