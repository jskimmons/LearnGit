
/**
 * Class that holds info for position and velocity of a throwObject
 * 
 * @author JoeSkimmons, jws2191
 * @version 2.5
 */
public class XYInfo {

	/**
	 * X position of throwObject
	 */
	private int xPosition;
	/**
	 * Y position of throwObject
	 */
	private int yPosition;
	/**
	 * X velocity of throwObject
	 */
	private int xVelocity;
	/**
	 * Y velocity of throwObject
	 */
	private int yVelocity;

	/**
	 * @param xPos
	 *            X Position
	 * @param yPos
	 *            Y Position
	 * @param xVel
	 *            X Velocity
	 * @param yVel
	 *            Y Velocity
	 */
	public XYInfo(int xPos, int yPos, int xVel, int yVel) {

		this.xPosition = xPos;
		this.yPosition = yPos;
		this.xVelocity = xVel;
		this.yVelocity = yVel;
	}

	/**
	 * @return X Position
	 */
	public int getxPosition() {
		return xPosition;
	}

	/**
	 * @return Y Position
	 */
	public int getyPosition() {
		return yPosition;
	}

	/**
	 * @param inc
	 *            amount to increase x Position by
	 */
	public void incrementxPosition(int inc) {
		xPosition += inc;
	}

	/**
	 * @param pos
	 *            to set as x Position
	 */
	public void setxPosition(int pos) {
		xPosition = pos;
	}

	/**
	 * @param inc
	 *            amount to increase Y Position by
	 */
	public void incrementyPosition(int inc) {
		yPosition += inc;
	}

	/**
	 * @param pos
	 *            to set as Y Position
	 */
	public void setyPosition(int pos) {
		yPosition = pos;
	}

	/**
	 * @return X Velocity
	 */
	public int getxVelocity() {
		return xVelocity;
	}

	/**
	 * @return Y Velocity
	 */
	public int getyVelocity() {
		return yVelocity;
	}
}
