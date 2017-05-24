
/*
 * This program creates an applet powered GUI that simulates the moves of Rock, Paper, Scissors, Lizard, Spock 
 * being thrown around the screen until they collide. When they collide, a game between those 
 * throws is simulated and the loser is removed. Important values are read in through an included html file.
 * The classes included are:
 * Playground: Creates the GUI on an applet, runs a timer to move the throws and detect collisions. Prints who wins each game and why.
 * RPSLKRules: Holds methods to determine the winner of each game and set the reason one throw beat the other.
 * XYInfo: Contains important info about each throwObject, including position and velocity
 * throwObject: Creates each throw object based on info passed from the HTML
 * Playground.html: HTML document containing each parameter to create throwObjects and determine game length
 * 
 */

import java.applet.Applet;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.LinkedList;
import javax.swing.Timer;

/**
 * This class creates an applet that runs the collision game GUI
 * 
 * @author JoeSkimmons, jws2191
 * @version 2.5
 */
public class Playground extends Applet {

	/**
	 * Delay in the appletTimer, taken in from html document, sets Frame Rate of
	 * GUI
	 */
	private int htmlDelay;
	/**
	 * Creates each frame of the GUI when it ticks
	 */
	private Timer appletTimer;
	/**
	 * Number of throwObjects to be seen
	 */
	private int htmlRectNumber;
	/**
	 * LinkedList of throwObjects
	 */
	private LinkedList<throwObject> throwObjects;
	/**
	 * Contains loser of the collision after any game, to be removed from the
	 * screen
	 */
	private throwObject remove;
	/**
	 * throwObject that displays the reason one object lost the collision game
	 * in top left corner
	 */
	private throwObject display;
	/**
	 * Max time without a collision before the game ends
	 */
	private int maxTime;
	/**
	 * Time since last Collision
	 */
	private int timeSinceLastCollision;

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.applet.Applet#init() Initializes the applet
	 */
	public void init() {

		// Globally used objects taken in from HTML
		htmlRectNumber = Integer.parseInt(getParameter("rectNumber"));
		maxTime = Integer.parseInt(getParameter("maxTime"));
		String htmlFontName = getParameter("fontName");
		int htmlFontSize = Integer.parseInt(getParameter("fontSize"));

		// creates a LinkedList of throwObjects to be painted on the screen as
		// either r,p,s,l or k. I chose a LinkedList because of its ease of
		// inserting and removing elements without a ripple effect
		throwObjects = new LinkedList<throwObject>();

		// idioms to establish Graphics environment
		Graphics2D g2D = (Graphics2D) getGraphics();

		// creates display object that will stay stationary and print the reason
		// for each game decision
		XYInfo displayInfo = new XYInfo(0, 0, 0, 0);
		display = new throwObject("", htmlFontName, htmlFontSize, displayInfo, g2D);

		// parses HTML and puts each respective parameter into an info object
		// and a throw object LinkedList
		for (int x = 0; x < htmlRectNumber; x++) {
			XYInfo info = new XYInfo(Integer.parseInt(getParameter("xPosition" + (x + 1))),
					Integer.parseInt(getParameter("yPosition" + (x + 1))),
					Integer.parseInt(getParameter("xVelocity" + (x + 1))),
					Integer.parseInt(getParameter("yVelocity" + (x + 1))));
			throwObjects
					.add(new throwObject(getParameter("throwName" + (x + 1)), htmlFontName, htmlFontSize, info, g2D));
		}

		// info for the timer
		// note that htmlDelay has to be available for the listener
		htmlDelay = Integer.parseInt(getParameter("delay"));
		// usual Timer idiom

		appletTimer = new Timer(htmlDelay, new ActionListener() {

			public void actionPerformed(ActionEvent e) {
				if (timeSinceLastCollision >= maxTime) {
					stop();
				}

				// causes the losing character and to disappear and the display
				// to be empty
				throwObjects.remove(remove);
				display.setThrowName("");

				// Moves each throwObject based on its x and y velocity
				for (int x = 0; x < htmlRectNumber; x++) {

					int yInc = throwObjects.get(x).getXYInfo().getxVelocity();
					int xInc = throwObjects.get(x).getXYInfo().getyVelocity();

					throwObjects.get(x).getXYInfo().incrementxPosition(yInc);
					throwObjects.get(x).getXYInfo().incrementyPosition(xInc);

					// checks that the characters are wrapping
					wrapAround(x);
				}

				// determines when a collision occurs, stops the timer, sets a
				// short delay
				remove = hasCollision();

				if (remove != null) {
					stop();
					repaint();

					appletTimer.setInitialDelay(2000);
					appletTimer.restart();
				}
				repaint();

			}
		});
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.applet.Applet#start() Starts the timer that controls the
	 * painting of the frame
	 */
	public void start() {
		appletTimer.start();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.awt.Container#paint(java.awt.Graphics) Paints each frame of the
	 * applet's runtime
	 */
	public void paint(Graphics g) {

		g.setFont(display.getThrowFont());
		g.drawString(display.getThrowName(), 0, 50);

		for (int x = 0; x < htmlRectNumber; x++) {

			// reset, if necessary, the paintbrush
			g.setFont(throwObjects.get(x).getThrowFont());
			// do the drawing
			// set location of throwRectangle
			throwObjects.get(x).setRectLocation(throwObjects.get(x).getxPosition(), throwObjects.get(x).getyPosition());
			g.drawString(throwObjects.get(x).getThrowName(), throwObjects.get(x).getxPosition(),
					throwObjects.get(x).getyPosition());
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.applet.Applet#stop() Stops the appletTimer
	 */
	public void stop() {
		appletTimer.stop();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.applet.Applet#destroy()
	 */
	public void destroy() {

	}

	/**
	 * This method makes sure each throwObject is wrapped and does not leave
	 * screen permanently
	 * 
	 * @param x
	 *            index of the throwObject List to be wrapped
	 */
	public void wrapAround(int x) {
		// x direction
		if (throwObjects.get(x).getxPosition() < (-1 * throwObjects.get(x).getThrowRectangle().getWidth()))
			throwObjects.get(x).getXYInfo().setxPosition(getWidth());

		if (throwObjects.get(x).getxPosition() + throwObjects.get(x).getThrowRectangle().getWidth() > getWidth()
				+ throwObjects.get(x).getThrowRectangle().getWidth()) {
			throwObjects.get(x).getXYInfo().setxPosition((int) throwObjects.get(x).getThrowRectangle().getWidth() * -1);
		}
		// y direction
		if (throwObjects.get(x).getyPosition() + throwObjects.get(x).getThrowRectangle().getHeight() > getHeight()) {
			throwObjects.get(x).getXYInfo()
					.setyPosition((int) throwObjects.get(x).getThrowRectangle().getHeight() * -1);
		}
		if (throwObjects.get(x).getyPosition() + throwObjects.get(x).getThrowRectangle().getHeight() < 0)
			throwObjects.get(x).getXYInfo().incrementyPosition(getHeight());
	}

	/**
	 * Determines if two throwObjects have collided
	 * 
	 * @return the throwObject that lost the head to head match against what it
	 *         collided with
	 */
	public throwObject hasCollision() {
		throwObject temp = null;
		timeSinceLastCollision += htmlDelay;

		RPSLKRules rules = new RPSLKRules();
		// checks collision between every object
		for (int i = 0; i < htmlRectNumber; i++) {
			for (int j = 0; j < htmlRectNumber; j++) {
				if (i != j
						&& throwObjects.get(i).getThrowRectangle().intersects(throwObjects.get(j).getThrowRectangle())) {
					// resets end of game timing algorithm
					timeSinceLastCollision = 0;
					temp = rules.getLoser(throwObjects.get(i), throwObjects.get(j));
					if(temp!=null){
					temp.setThrowName("");
					// displays reason for who won the collision
					display.setThrowName(RPSLKRules.displayString);
					htmlRectNumber--;
					return temp;
					}
				}
			}
		}
		return temp;
	}
}
