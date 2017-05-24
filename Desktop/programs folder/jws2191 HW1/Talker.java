import java.util.Scanner;

/**
 * Class that creates Talker objects in order to handle sloppy
 * or malevolent input. The Scanner class is imported to handle 
 * user input
 * @author JoeSkimmons, jws2191
 * @version 1.3
 */
public class Talker {

private String input;

	/**
	 * Constructor
	 * initiates the input to an empty string to be filled later by a method
	 */
	public Talker(){
		input = "";
	}
	
	/**
	 * Method that compares the user input to the THROWS array to make sure it is a playable character
	 * or a z to end the game
	 * @return String input which is guaranteed to be in the THROWS array
	 * and therefore be playable in the game
	 */
	public String getInput(){
		Scanner s = new Scanner(System.in);
		System.out.println("Please enter your throw.");
		input = s.nextLine();
		for(String compare : Game.getTHROWS()){
			if(compare.equals(input) || input.equals("z")){
				return input;
			}
		}
			System.out.println("Invalid Input");
			return this.getInput();
	}	
}
