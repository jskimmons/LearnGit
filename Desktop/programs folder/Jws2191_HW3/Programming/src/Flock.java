
/**
 * Creates a Flock of Birds that move across the Screen and grow.
 * 
 * @author JoeSkimmons
 *
 */
public class Flock implements FlyingObject {

	/**
	 * Array of BirdCanvases
	 */
	static BirdCanvas birdCanvasArr[] = new BirdCanvas[5];
	/**
	 * Controls the rate at which the bird grows.
	 */
	private int growCount;

	/**
	 * Number of birds to be drawn to the screen
	 */
	private int numberOfBirds = 5;

	/**
	 * Creates a flock object
	 */
	Flock() {

		// Instantiates the bird canvases
		for (int x = 0; x < numberOfBirds; x++) {
			birdCanvasArr[x] = new BirdCanvas();
		}
	}

	/**
	 * Moves the bird to the right across the screen
	 * 
	 * @param xchange
	 *            rate of change of the bird in the x direction
	 * @param ychange
	 *            rate of change of the bird in the y direction
	 */
	public void translate(int xchange, int ychange) {

		for (int x = 0; x < numberOfBirds; x++) {
			// grows each bird
			this.grow(1);
			// sets the bounds of each birdCanvas and its location
			birdCanvasArr[x].setBounds(birdCanvasArr[x].getX() + xchange, birdCanvasArr[x].getY() + ychange,
					Bird.birdUNIT * 2 + 5, Bird.birdUNIT * 2 + 5);
		}
	}

	/*
	 * (non-Javadoc) Draws a flock
	 * 
	 * @see FlyingObject#draw()
	 */
	public void draw() {
		for (int x = 0; x < numberOfBirds; x++) {
			// adds each birdCanvas to the contentPane
			Screen.contentPane.add(birdCanvasArr[x]);

			int l = (int) (Math.random() * 1000);
			int h = (int) (Math.random() * 200);
			int lb = Bird.birdUNIT * 2 + 5;
			int hb = Bird.birdUNIT * 2 + 5;
			// sets the birdCanvas at a random location with proper boudns based
			// on birdUNIT
			birdCanvasArr[x].setBounds(l, h, lb, hb);
		}
	}

	/**
	 * @param i
	 *            rate of change of the growth of birdUNIT
	 */
	public void grow(int i) {
		/*
		 * the growCount and modulus operation allows the growth to only happen
		 * every 20th tick of the Timer in the Screen class
		 */

		growCount++;
		if (growCount % 20 == 0)
			Bird.birdUNIT = Bird.birdUNIT + i;
	}

}
