import java.util.ArrayList;

/**
 * Class that contains the rules for RPSLK in order to determine the winner of
 * each collision
 * 
 * @author JoeSkimmons, jws2191
 * @version 2.5
 */
public class RPSLKRules {

	/**
	 * Contains each move possible in RPSLK
	 */
	private ArrayList<String> moves;
	/**
	 * Generates reason for one move winning over the other, given two indicies
	 * from the moves List
	 */
	private String[][] reason;
	/**
	 * String to be displayed in the GUI, describes who won the collision and
	 * why
	 */
	static String displayString;

	/**
	 * Constructs the moves and reason lists
	 */
	public RPSLKRules() {
		moves = new ArrayList<String>();
		moves.add("r");
		moves.add("p");
		moves.add("s");
		moves.add("k");
		moves.add("l");

		reason = new String[5][5];

		String[] VERBS_ROW_1 = { "ties", "covers", "crushes", "vaporizes", "crushes" };
		String[] VERBS_ROW_2 = { "covers", "ties", "cuts", "disproves", "eats" };
		String[] VERBS_ROW_3 = { "crushes", "cuts", "ties", "smashes", "decaptiates" };
		String[] VERBS_ROW_4 = { "vaporizes", "disproves", "smashes", "ties", "poisons" };
		String[] VERBS_ROW_5 = { "crushes", "eats", "decapitates", "poisons", "ties" };

		for (int x = 0; x < 5; x++) {
			for (int y = 0; y < 5; y++) {
				if (x == 0)
					reason[y][x] = VERBS_ROW_1[y];
				else if (x == 1)
					reason[y][x] = VERBS_ROW_2[y];
				else if (x == 2)
					reason[y][x] = VERBS_ROW_3[y];
				else if (x == 3)
					reason[y][x] = VERBS_ROW_4[y];
				else if (x == 4)
					reason[y][x] = VERBS_ROW_5[y];
			}
		}
	}

	/**
	 * This method decides who loses between two colliding throwObjects
	 * 
	 * @param a,
	 *            b two collided throwObjects
	 * @return loser of the collision, based on RPSLK formula (Formula to
	 *         determine winner adapted from source
	 *         http://stackoverflow.com/questions/9553058/scalable-solution-for-rock-paper-scissor)
	 */
	public throwObject getLoser(throwObject a, throwObject b) {
		int move1 = moves.indexOf(a.getThrowName());
		int move2 = moves.indexOf(b.getThrowName());
		int d = (moves.size() + move1 - move2) % moves.size();

		// d is 1 or 3 if a wins
		if (d == 1 || d == 3) {
			displayString = a.getThrowName() + " " + reason[move1][move2] + " " + b.getThrowName();
			a.setFontSize(b.getFontSize());
			return b;
		}
		// d is 2 or 4 if b wins
		else if (d == 2 || d == 4) {
			displayString = b.getThrowName() + " " + reason[move1][move2] + " " + a.getThrowName();
			b.setFontSize(a.getFontSize());
			return a;
		}
		// in case of a tie, nothing is displayed. The two will pass through one
		// another when a tie occurs
		return null;
	}

	/**
	 * @return moves ArrayList
	 */
	public ArrayList<String> getMoves() {
		return moves;
	}
}
