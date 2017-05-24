import java.awt.geom.GeneralPath;

/**
 * Creates a bird General Path
 * 
 * @author JoeSkimmons
 * @version 2.3
 */
public class Bird implements FlyingObject {

	/**
	 * length from the left wing to the center of the bird. Static for use in
	 * the Flock class
	 */
	static int birdUNIT = 20;
	/**
	 * Shape of the Bird
	 */
	private GeneralPath bird;

	/**
	 * Creates a Bird GeneralPath
	 */
	public Bird() {
		draw();
	}

	/**
	 * @return the Bird GeneralPath
	 */
	public GeneralPath getBird() {
		return bird;
	}

	/*
	 * Draws the Bird GeneralPath (non-Javadoc)
	 * 
	 * @see FlyingObject#draw()
	 */
	@Override
	public void draw() {
		bird = new GeneralPath();
		bird.moveTo(0, 0);
		bird.lineTo(birdUNIT, birdUNIT * 2);
		bird.moveTo(birdUNIT * 2, 0);
		bird.lineTo(birdUNIT, birdUNIT * 2);
		bird.closePath();
	}

	/**
	 * @return birdUnit
	 */
	public int getBirdUnit() {
		return birdUNIT;
	}

	/**
	 * @param i
	 *            the rate of change of the birdUnit
	 */
	public void setBirdUnit(int i) {
		birdUNIT = birdUNIT + i;
	}
}
