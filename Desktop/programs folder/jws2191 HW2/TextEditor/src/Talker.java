import java.util.Scanner;

/**
 * This class takes input from the user, in the form of talker objects.
 *  It is able to handle possible errors by limiting what the User can enter.
 * 
 * @author JoeSkimmons, jws2191
 * @version 1.0
 */

public class Talker {	
	
private String sInputString;
private String userInput;
private String command;

	/**
	 * This constructs a talker object. 
	 */

	public Talker(){
	}
	/**
	 * This method instantiates a new scanner to take input from the user
	 * and splits this info, found in 'userInput' into a command, 'command' and input string, 'sInputString' using substrings.
	 * 
	 */
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
	}
	
	/**
	 * @return command
	 * Where command is what operation the user 
	 * wants performed on the input.
	 */
	
	public String getCommand(){
		return command;
	}

	/**
	 * @return sInputString
	 * Where sInputString is the input the user wants to use with 
	 * the command.
	 */
	public String getsInputString(){
		return sInputString;
	}
	
	/**
	 * @return userInput
	 * Where userInput is the whole string inputed by the user.
	 */
	public String getUserInput(){
		return userInput;
	}

}
