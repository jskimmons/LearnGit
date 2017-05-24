import java.awt.Graphics;
import java.awt.Graphics2D;

import javax.swing.JLabel;

/**
 * Extends JLabel and paints a bird to itself each time it is instantiated.
 * 
 * @author JoeSkimmons
 * @version 2.3
 */
public class BirdCanvas extends JLabel {

	/*
	 * (non-Javadoc)
	 * 
	 * @see javax.swing.JComponent#paintComponent(java.awt.Graphics) 
	 * Paints a Bird generalPath to itself
	 */
	public void paintComponent(Graphics g) {
		super.paintComponent(g);
		Graphics2D g2 = (Graphics2D) g;
		g2.draw(new Bird().getBird());
	}
}