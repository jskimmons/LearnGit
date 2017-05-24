/**
 * This program creates a GUI which depicts a randomly generated Mob of
 * StickFigures and a flock of birds that move across the screen based on the
 * speed given by a slider at the bottom of the frame.
 * 
 * The classes included in this program are:
 * 
 * Screen: Extends JFrame, creates the stage for the moving objects to move
 * across the screen. Also holds the slider.
 * 
 * StickFigure: Draws a StickFigure GeneralPath when instantiated.
 * 
 * Canvas: Extends JLabel, paints a StickFigure GeneralPath to itself when
 * created.
 * 
 * Mob: Creates a random number of canvases and adds them to the Screen.
 * Randomizes the size of each StickFigure and their respective position.
 * Provides methods for movement.
 * 
 * Bird: Draws a Bird GeneralPath when instantiated.
 * 
 * Flock: Creates a fixed number of BirdCanvases and adds them to the Screen,
 * providing methods for movement and growth over time.
 * 
 * BirdCanvas: Extends JLabel, paints a Bird GeneralPath to itself when created.
 * 
 * FlyingObject: Interface that generalizes the drawing and movement of all
 * flying objects (birds and flocks)
 * 
 * MovingObject: Interface that generalizes the drawing and movement of ground
 * objects (stickFigure and Mobs)
 * 
 * @author JoeSkimmons
 * @version 2.3
 */
public class HW4_Runner {

	public static void main(String[] args) {
		new Screen();
	}
}