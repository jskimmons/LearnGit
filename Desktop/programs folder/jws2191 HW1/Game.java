/**
 * Class that Creates Game Object that prints the rules
 * of the game and decides who wins between two Thrower objects
 * Also keeps track of the statistics for use after the game.
 * @author Joe Skimmons, jws2191
 * @version 1.3
 */

public class Game {
	
	private boolean endGame;
	private int compWins;
	private int numDraws;
	private int userWins;
	private String player1;
	private String player2;
	private String totalGames;
	public static int numGames;
	public static String[] THROWS = {"r","p","s","k","l"};
	public static int rotateIndex;
	private String[] VERBS_ROW_1 = {"ties", "covers", "crushes", "vaporizes", "crushes"};
	private String[] VERBS_ROW_2 = {"covers","ties","cuts","disproves","eats"};
	private String[] VERBS_ROW_3 = {"crushes","cuts","ties","smashes", "decaptiates"};
	private String[] VERBS_ROW_4 = {"vaporizes", "disproves", "smashes", "ties", "poisons"};
	private String[] VERBS_ROW_5 = {"crushes", "eats", "decapitates", "poisons", "ties"};
	
		/**
		 * Constructor
		 * Initializes variables that will be used to determine statistics
		 * @param p1 String that determines the type of Thrower (random, user input, etc.) for player 1
		 * @param p2 String that determines the type of Thrower (random, user input, etc.) for player 2
		 * @param t String that will be converted to an integer, determines the number of games played
		 */
		public Game(String p1, String p2, String t) {
			
			endGame = false;
			System.out.println("Welcome");
			String rules = "The player can choose to play either rock ('r'), paper('p'), scissors('s'), lizard ('l') or \n"
			+ "spock ('s') on the keypad\n"
			+ "in order to defeat the computer, who will be randomly selecting an item from the same list. \n"
			+ "The winner is decided based on the following criteria:\n"
			+ "1) Rock crushes scissors.\n"
			+ "2) Scissors cuts paper.\n"
			+ "3) Paper covers rock. \n"
			+ "4) rock crushes lizard \n"
			+ "5) lizard poisons spock \n"
			+ "6) spock vaporizes rock \n"
			+ "7) paper disproves spock \n"
			+ "8) spock smashes scissors \n"
			+ "9) scissors decapitates lizard \n"
			+ "10) lizard eats paper \n"
			+ "Good luck!";
			System.out.println(rules);
			
			compWins = 0;
			numDraws = 0;
			userWins = 0;
			numGames = 0;
			player1 = p1;
			player2 = p2;
			totalGames = t;
		}

		/**
		 * Method that runs the game, creates two Thrower objects that 
		 * play a different strategy and determines who wins each round.
		 * Also creates a 2-D array that prints the reason one player
		 * was defeated.
		 */
		public void runGame(){	
			Thrower computer = new Thrower();
			Thrower human = new Thrower();
			Thinker thinker = new Thinker();
			int result = Integer.parseInt(totalGames);
			rotateIndex = 0;
			
			String [][] reason = new String [5][5];
			
			for(int x=0; x<5; x++){
				for(int y=0; y<5; y++){
					if(x == 0)
						reason[y][x] = VERBS_ROW_1[y];
					else if(x == 1)
						reason[y][x] = VERBS_ROW_2[y];
					else if(x == 2)
						reason[y][x] = VERBS_ROW_3[y];
					else if(x == 3)
						reason[y][x] = VERBS_ROW_4[y];
					else if(x == 4)
						reason[y][x] = VERBS_ROW_5[y];
				}
			}
			
			
			/**begins loop that picks throws for each game and
			decides each winner.
			*/
			
			while (endGame == false && numGames < result){
				
				int index1 = 0;
				int index2 = 0;
				String moveA = "";
				String moveB = "";
				
				moveA = thinker.bestThrow();
				moveB = human.getThrow(player2);
				
				thinker.tallyThrows(moveB);
				
				
				System.out.println("Game " + (numGames + 1));
				System.out.println("Computer: " + moveA);
				System.out.println("Human: " + moveB);
				
				for(int x=0; x<THROWS.length; x++){
					if(moveA.equals(THROWS[x]))
						index1 = x;
					if(moveB.equals(THROWS[x]))	
						index2 = x;
				}
				
				/*
				*Algorithm to determine winner, d is odd if player 1 wins,
				*even if player 2 wins, and 0 if there is a tie
				*I found the mathematical algorithm at: 
				*http://stackoverflow.com/questions/9553058/scalable-solution-for-rock-paper-scissor
				*and implemented it into my code
				*/
				
				int d = (5 + index2 - index1) % 5;
				
				if (moveB.equals("z")){
					System.out.println("Thanks for playing!");
					endGame = true;
				}
				else if (d==0){
					System.out.println("There is a tie!");
					numDraws++;
					numGames++;
					System.out.println(moveA + " " + reason[index1][index2] + " " + moveB);
				
				}
				else if(d%2==0){
					System.out.println("The computer wins!");
					userWins++;
					numGames++;
					System.out.println(moveA + " " + reason[index1][index2] + " " + moveB);
				}
				else if(d%2 != 0){
					System.out.println("You win!");
					compWins++;
					numGames++;
					System.out.println(moveB + " " + reason[index1][index2] + " " + moveA);
				}
				
				rotateIndex++;
				if(rotateIndex == Game.THROWS.length){
					rotateIndex = 0;
				}
			}
			
		}
		
		/**
		 * Method to calculate and print statistics for the game that just finished.
		 * @return String containing the number of games won by each player and the 
		 * percentage of games won by each
		 */
		public String statistics(){	
		
			if(numGames != 0){
			String compGames = "The Computer won " + compWins + " games\n";
			String userGames = "The user won " + userWins + " games\n";
			String ties = numDraws + " games ended in a draw\n";
			double userPercentage = ((double)userWins/numGames)*100;
			double compPercentage = ((double)compWins/numGames)*100;
			
			return compGames + userGames + ties + "The computer won " + compPercentage + "% of the games\nYou won " + userPercentage + "% of the games";
		}
		
		else {
			return "No games were played.";
		}
		}
	
		/**
		 * Static method used to make the THROWS array seen by all,
		 * allows changes to the array to be localized to this class only
		 * @return String[] THROWS
		 */
		public static String[] getTHROWS(){
			return THROWS;
		}
}


