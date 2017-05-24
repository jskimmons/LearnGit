import java.applet.Applet;
import java.awt.*;
import java.awt.event.*;
import java.awt.font.FontRenderContext;
import java.awt.geom.Rectangle2D;

import javax.swing.Timer;

/**
 * 
 * @author jrk based on cay horstmann
 * 
 *         needs an html file (real or simulated) that looks like:
 * 
 *         <applet code="Playground.class" width="xxx" height="yyy">
 *         <param name="parameter1" value="value1"/>
 *         <param name="parameter2" value="value2"/> < . . etc . . . />
 *         </applet>
 *
 */
public class Playground extends Applet {

	// html parameters
	private String[] htmlThrowName;
	private int htmlDelay;
	private int xVelocity;
	private int yVelocity;
	// variables associated with the throw String
	private Font throwFont;
	// private Rectangle2D throwRectangle;
	// timer stuff
	private Timer appletTimer;
	private Rectangle2D[] throwRectangle;
	private int[] xPosition;
	private int[] yPosition;
	private int htmlRectNumber;

	/**
	 * Idioms for applet initialization, mostly to get parameters; use
	 * convention that incoming parameters are prefixed with "html"
	 */
	public void init() {

		// info necessary for making strings look nice
		// note that throwFont has to be available for paint()
		// but htmlFontName and htmlFontSize are only used locally
		
		String htmlFontName = getParameter("fontName");
		int htmlFontSize = Integer.parseInt(getParameter("fontSize"));
		throwFont = new Font(htmlFontName, Font.BOLD, htmlFontSize);
		
		// import x and y velocities
		xVelocity = Integer.parseInt(getParameter("xVelocity"));
		yVelocity = Integer.parseInt(getParameter("yVelocity"));
		
		// idioms to establish Graphics environment
		Graphics2D g2D = (Graphics2D) getGraphics();
		// idioms to get information about the applet "paintbrushes"
		FontRenderContext throwContext = g2D.getFontRenderContext();
		// get the bounding rectangle around htmlThrow when painted
		// note that throwRectangle has to be available for the Listener
		// instantiates the array of rectangles containing strings
		htmlRectNumber = Integer.parseInt(getParameter("rectNumber"));
		htmlThrowName = new String[htmlRectNumber];
		xPosition = new int[htmlRectNumber];
		yPosition = new int[htmlRectNumber];
		throwRectangle = new Rectangle2D[htmlRectNumber];
		
		// note throwY has to be available for paint()
		// note that getY() returns a *double*, so it has to be cast to an int
		// but getSTringBounds measures the height from the *lower* left,
		// so its height is negative, since Y going *up* is negative
		// yes, *three* violations of Principle of Least Surprise in one line!
		// throwY = Integer.parseInt(getParameter("yPosition"));
		// throwX starts on the right side of the component
		// throwX = Integer.parseInt(getParameter("xPosition"));

		for (int x = 0; x < htmlRectNumber; x++) {
			
			htmlThrowName[x] = getParameter("throwName" + (x + 1));
			xPosition[x] = Integer.parseInt(getParameter("xPosition" + (x + 1)));
			yPosition[x] = Integer.parseInt(getParameter("yPosition" + (x + 1)));
			throwRectangle[x] = throwFont.getStringBounds(htmlThrowName[x], throwContext);
			throwRectangle[x].setFrame(xPosition[x], yPosition[x], throwRectangle[x].getWidth(),
					throwRectangle[x].getHeight());

		}
		// info for the timer
		// note that htmlDelay has to be available for the listener
		htmlDelay = Integer.parseInt(getParameter("delay"));
		// usual Timer idiom

		appletTimer = new Timer(htmlDelay, new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				
				for (int x = 0; x < htmlRectNumber; x++) {
					
					xPosition[x] += xVelocity;
					yPosition[x] += yVelocity;
					
					// throwX += xVelocity;
					// throwY += yVelocity;
					// check for wrap-around
					// note that the second getWidth() is from Applet!

					if (xVelocity == -1) {
						if (xPosition[x] < (-1 * throwRectangle[x].getWidth()))
							xPosition[x] = getWidth();
					} else if (xVelocity == 1) {
						if (xPosition[x] + throwRectangle[x].getWidth() > getWidth() + throwRectangle[x].getWidth())
							xPosition[x] = (int) throwRectangle[x].getWidth() * -1;
					}
					if (yVelocity == 1) {
						if (yPosition[x] + throwRectangle[x].getHeight() > getHeight())
							yPosition[x] = (int) throwRectangle[x].getHeight() * -1;
					} else if (yVelocity == -1) {
						if (yPosition[x] + throwRectangle[x].getHeight() < 0)
							yPosition[x] = getHeight();
					}

					repaint();
				}
			}
		});
	}


	public void start() {
		appletTimer.start();
	}

	public void paint(Graphics g) {
		
		for(int x = 0; x<htmlRectNumber; x++){
			// reset, if necessary, the paintbrush
			g.setFont(throwFont);
			// do the drawing
			// note that throwLeftSide is the only thing that changes between
			// paintings
			g.drawString(htmlThrowName[x], xPosition[x], yPosition[x]);
		}
	}

	public void stop() {
		appletTimer.stop();
	}

	public void destroy() {
	}
}
