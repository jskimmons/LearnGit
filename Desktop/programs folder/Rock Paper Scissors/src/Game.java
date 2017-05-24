
public class Game {
	
	private boolean endGame;
	private int compWins;
	private int draw;
	private int userWins;
	private int numGames;
	
	public Game(){
		
		endGame = false;
		
		System.out.println("Welcome!");
		String rules = "The player can choose to play either rock ('r'), paper('p'), or scissors('s') on the keypad\n"
		+ "in order to defeat the computer, who will be randomly selecting an item from the same list. \n"
		+ "The winner is decided based on the following criteria:\n"
		+ "1) Rock beats scissors.\n"
		+ "2) Scissors beats paper.\n"
		+ "3) Paper beats rock. \n"
		+ "4) Paper beats scissors \n"
		+ "Good luck!";
		System.out.println(rules);
		
		compWins = 0;
		draw = 0;
		userWins = 0;
		numGames = 0;
		
		while (endGame == false){
		
		Computer computer1 = new Computer();
		Human human1 = new Human();
		System.out.println("Computer: " + computer1.getThrow());
		System.out.println("Player: " + human1.getVoice());
	
		if (computer1.getThrow().equals(human1.getVoice())){
			System.out.println("Draw!");
			draw++;
			numGames++;
		}
		else if (computer1.getThrow().equals("r") && human1.getVoice().equals("s")){
			System.out.println("The Computer wins!");
			compWins++;
			numGames++;
		}
		else if (computer1.getThrow().equals("s") && human1.getVoice().equals("p")){
			System.out.println("The Computer wins!");
			compWins++;
			numGames++;
		}
		else if (computer1.getThrow().equals("p") && human1.getVoice().equals("r")){
			System.out.println("The Computer wins!");
			compWins++;
			numGames++;
		}
		else if (computer1.getThrow().equals("s") && human1.getVoice().equals("r")){
			System.out.println("You win!");
			userWins++;
			numGames++;
		}
		else if (computer1.getThrow().equals("r") && human1.getVoice().equals("p")){
			System.out.println("You win!");
			userWins++;
			numGames++;
		}
		else if (computer1.getThrow().equals("p") && human1.getVoice().equals("s")){
			System.out.println("You win!");
			userWins++;
			numGames++;
		}
		else if (human1.getVoice().equals("z")){
			System.out.println("Thanks for playing!");
			endGame = true;	
		}
		}
	}

	public String statistics(){
		
	if(numGames != 0){
		String compGames = "The Computer won " + compWins + " games\n";
		String userGames = "The User won " + userWins + " games\n";
		String ties = draw + " games ended in a draw\n";
		double userPercentage = ((double)userWins/numGames)*100;
		double compPercentage = ((double)compWins/numGames)*100;
		
		return compGames + userGames + ties + "The computer won " + compPercentage + "% of the games\nYou won " + userPercentage + "% of the games";
	}
	
	else {
		return "No games were played.";
	}
	}
}

