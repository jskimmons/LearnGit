import java.awt.Point;
import java.util.Random;

/**
 * Creates a Mob of Stick Figures that move across the Screen.
 * 
 * @author JoeSkimmons
 * @version 2.3
 */
public class Mob implements MovingObject{

	/**
	 * Array of Canvases which will hold StickFigures
	 */
	static Canvas[] canvasArr;
	/**
	 * Array of StickFigures with varying sizes
	 */
	static StickFigure[] stickArr;
	/**
	 * Random number (between 3 and 7), used to create the arrays
	 */
	private int randomNum;
	/**
	 * Random object, used to generate randomNum
	 */
	private Random rand;

	/**
	 * Constructor that initializes the fields and gets random UNIT sizes for
	 * each StickFigure
	 */
	public Mob() {
		rand = new Random();
		randomNum = rand.nextInt((7 - 3) + 1) + 3;
		canvasArr = new Canvas[randomNum];
		stickArr = new StickFigure[randomNum];
		for (int x = 0; x < randomNum; x++) {
			stickArr[x] = new StickFigure((int) (Math.random() * 30 + 10));
			canvasArr[x] = new Canvas(x);
		}
	}

	/**
	 * @param xchange
	 *            rate of change in the x direction
	 * @param ychange
	 *            rate of change in the y direction
	 */
	public void translate(int xchange, int ychange) {
		for (int x = 0; x < randomNum; x++) {
			canvasArr[x].setLocation(canvasArr[x].getX() + xchange, canvasArr[x].getY() + ychange);
			this.isContained(x);
		}
	}

	/**
	 * Draws the mob to the Screen.
	 */
	public void draw() {
		for (int x = 0; x < randomNum; x++) {
			// adds each canvas in the array to the contentPane
			Screen.contentPane.add(canvasArr[x]);
			//adds each to a random position in a partition of the screen, chosen for maximum visability.
			int l = (int) (Math.random() * 1000);
			int h = (int) (Math.random() * 600);
			int lb = stickArr[x].getUnit() * 2 + 1;
			int rb = stickArr[x].getUnit() * 5;

			// sets bounds and a random location of each canvas containing a
			// stickFigure
			canvasArr[x].setBounds(l, h, lb, rb);
		}
	}

	/**
	 * Keeps the Mob contained in the screen, when a stickFigure exits to the right
	 * @param x
	 */
	public void isContained(int x) {
		// creates three points that must be held on the screen for the figure to be visible
		Point p = new Point(canvasArr[x].getX(), canvasArr[x].getY());
		Point q = new Point(canvasArr[x].getX(), (int) (canvasArr[x].getY() + stickArr[x].getUnit() * 5));
		Point r = new Point((int) (canvasArr[x].getX() + stickArr[x].getUnit() * 2), canvasArr[x].getY());

		// returns the Stickfigure to the left side of the screen if it exits to the right
		if (!(Screen.contentPane.contains(p) && Screen.contentPane.contains(q) && Screen.contentPane.contains(r))) {
			canvasArr[x].setLocation(0, canvasArr[x].getY());
		}

	}
}
