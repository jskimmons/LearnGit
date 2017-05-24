/**
 * Class that creates Thinker objects which assist the Thrower in trying
 * to defeat the simulated players. This thinker is very simple in its logic
 * but its strategy should assist the computer in winning more games. It was able to improve
 *the winning percentage of the Computer by almost 40%, as shown in
 *the output files provided.
 * @author JoeSkimmons, jws2191
 * @version 1.3
 */
public class Thinker {
private int totalRock=0;
private int totalScissors=0;
private String bestMove;
	/**
	 * Constructor
	 */
	public Thinker(){
	}
	
	/**
	 * Method that tallys the total Rock moves and Scissor moves of the human
	 * @param l String that contains the Human's last move
	 * @void 
	 */ 
	public void tallyThrows(String l){
		if(l.equals("r"))
			totalRock++;
		if(l.equals("s"))
			totalScissors++;
	}
	
	/**
	 * Method that determines the best throw to be spock
	 * if the number of rock and scissors moves exceeds 2.
	 * @return String containing the thinker's chosen move.
	 */
	public String bestThrow(){
		if(totalRock>=2 || totalScissors>=2){
			bestMove = "s";
		}
		
		else{
			bestMove = Game.THROWS[(int)(Math.random() * Game.THROWS.length)];
		}
		return bestMove;
	}
}
