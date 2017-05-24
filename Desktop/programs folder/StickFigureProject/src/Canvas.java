import java.awt.Graphics;
import java.awt.Graphics2D;

import javax.swing.JLabel;

/**
 * Extends JLabel and paints a specific StickFigure (given an ID) to itself each
 * time it is instantiated.
 * 
 * @author JoeSkimmons
 * @version 2.3
 */
public class Canvas extends JLabel {

	private int ID;

	/**
	 * @param x
	 *            taken in to set the ID of the canvas.
	 */
	public Canvas(int x) {
		this.ID = x;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see javax.swing.JComponent#paintComponent(java.awt.Graphics) 
	 * Paints and fills a StickFigure on the canvas
	 */
	public void paintComponent(Graphics g) {
		super.paintComponent(g);
		Graphics2D g2 = (Graphics2D) g;
		g2.draw(Mob.stickArr[ID].getStickFigure());
		g2.fill(Mob.stickArr[ID].getStickFigure());
	}
}