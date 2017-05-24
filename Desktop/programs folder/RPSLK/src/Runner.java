
public class Runner {

	/**
	 * OVERVEIW OF SYSTEM:
	 * Game: Class that runs the game and tracks statistics
	 * Talker: Class that handles input from user
	 * Thrower: Class that creates players for the game and decides what they will throw
	 * Thinker: Class that provides basic strategy for the Thrower to use
	 * @param args taken in from the user in command line
	 * @author Joe SKimmons, jws2191
	 */
	
	public static void main(String[] args) {

	Game game1 = new Game("user", "random", "100000");
	game1.runGame();
	System.out.println(game1.statistics());
	
	}
}

