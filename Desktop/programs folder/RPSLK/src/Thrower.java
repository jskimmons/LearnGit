/**
 * Class that creates Thrower objects which represent
 * the players of the game of RPSLK. Each can represent a
 * computer, simulated human, or the user.
 * @author JoeSkimmons, jws2191
 * @version 1.3
 */
public class Thrower {

private String move;
private String[] Throws;
	/**
	 * Constructor
	 * Instantiates the String move with an empty string,
	 * Puts the THROWS method from the Game class into
	 * the Throws array for use in this class.
	 * Allows changes in that array to be localized to the Game class
	 */
	public Thrower(){	
		Throws = Game.getTHROWS();
	}

	/**
	 * Method that returns the Throw of the Thrower object.
	 * @param p String inputed by the command line that tells the method how to retrieve
	 * the move for that Thrower object
	 * @return String move that contains the move of any of the Thrower objects
	 */
	public String getThrow(String p) {
		
		if (p.equals("random")){
			move = Throws[(int)(Math.random() * Throws.length)];
		}
		else if (p.equals("user")){
			Talker talker = new Talker();
			move = talker.getInput();
		}
		else if (p.equals("rotator")){
			move = Throws[Game.rotateIndex];
		}
		return move;
	}
}