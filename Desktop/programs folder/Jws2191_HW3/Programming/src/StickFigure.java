import java.awt.geom.Ellipse2D;
import java.awt.geom.GeneralPath;

/**
 * This class creates a StickFigure GeneralPath given a specific UNIT value. The
 * UNIT is set at 20 by default.
 * 
 * @author JoeSkimmons
 *
 */
public class StickFigure implements MovingObject {

	/**
	 * Radius of the head
	 */
	private int UNIT = 20;
	/**
	 * Shape of the StickFigure
	 */
	private GeneralPath stickFigure;

	/**
	 * Creates a stickFigure object given a size
	 * 
	 * @param size
	 *            represents the radius of the head, and the size of the rest of
	 *            the body in proportion.
	 */
	public StickFigure(int size) {

		this.UNIT = size;
		draw();
	}

	/**
	 * @return stickFigure GeneralPath
	 */
	public GeneralPath getStickFigure() {
		return stickFigure;
	}

	/**
	 * Draws a StickFigure GeneralPath
	 */
	@Override
	public void draw() {
		stickFigure = new GeneralPath(new Ellipse2D.Float(0, 0, 2 * UNIT, 2 * UNIT)); // head
		stickFigure.moveTo(UNIT, UNIT * 2);
		stickFigure.lineTo(UNIT, UNIT * 4); // body
		stickFigure.moveTo(UNIT, UNIT * 4);
		stickFigure.lineTo(0, UNIT * 5); // left leg
		stickFigure.moveTo(UNIT, UNIT * 4);
		stickFigure.lineTo(UNIT * 2, UNIT * 5); // right leg
		stickFigure.moveTo(UNIT, UNIT * 3);
		stickFigure.lineTo(UNIT * 2, UNIT * 2); // right arm
		stickFigure.moveTo(UNIT, UNIT * 3);
		stickFigure.lineTo(0, UNIT * 2); // left arm
		stickFigure.closePath();
	}

	/**
	 * @return UNIT
	 */
	public int getUnit() {
		return UNIT;
	}

	/**
	 * This method does not function because a stickFigure cannot move without a
	 * Mob
	 * 
	 * @param xchange
	 *            rate of change in the x direction
	 * @param ychange
	 *            rate of change in the y direction
	 */
	public void translate(int xchange, int ychange) {
		System.out.println("Cannot move a StickFigure on its own");
	}
}
