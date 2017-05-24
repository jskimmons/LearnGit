
import java.awt.Toolkit;
import java.util.Timer;
import java.util.TimerTask;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import javax.swing.JSlider;

/**
 * This class extends JFrame and creates the "stage" for the Mob and Flock to
 * move on. A JPanel is added for each object to be placed onto. The JSlider is
 * added to the bottom of the JFrame, controlling the speed of the Mob. Window
 * Height and Window Length are set to constants that are taken from the User's
 * distinct width and height of screen.
 * 
 * @author JoeSkimmons
 * @version 2.3
 */
public class Screen extends JFrame {

	/**
	 * Window length, taken from the User's screen
	 */
	private final int WINDOW_LENGTH = (int) Toolkit.getDefaultToolkit().getScreenSize().getWidth();
	/**
	 * Window Height, taken from the User's screen
	 */
	private final int WINDOW_HEIGHT = (int) Toolkit.getDefaultToolkit().getScreenSize().getHeight();
	/**
	 * Speed of the mob, it is static in order for the Slider to take the value
	 * and pass it to the changeListener
	 */
	private static int speed;
	/**
	 * JPanel where the mob, flock, and slider are placed. Static to give easy
	 * access to the Flock and Mob classes
	 */
	static JPanel contentPane;

	/**
	 * This default constructor instantiates a new Mob and Flock object to be
	 * placed. A null layout is used for the contentPane because it allows
	 * easier translation of the objects across the JPanel with the use of
	 * absolute positioning. A timer is created to control the translation of
	 * the flock and mob in a smooth manner. The JSlider allows left and right
	 * movement of the mob and the ability to stop it. The mob is initialized
	 * with a speed of 0.
	 * 
	 */
	public Screen() {

		Mob mob = new Mob();
		Flock flock = new Flock();

		// JFrame housekeeping... setting the contentPane
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		getContentPane().setLayout(null);
		setBounds(0, 0, WINDOW_LENGTH, WINDOW_HEIGHT);
		setVisible(true);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(0, 0, WINDOW_LENGTH, WINDOW_HEIGHT));
		contentPane.setLayout(null);
		setContentPane(contentPane);

		// creates a timer and has it translate the mob and flock every 10 ms,
		// with a 30 ms delay
		Timer timer = new Timer();
		TimerTask task = new TimerTask() {
			@Override
			public void run() {
				mob.translate(speed, 0);
				flock.translate(1, 0);
			}
		};
		timer.schedule(task, 30, 10);

		JSlider slider = new JSlider(JSlider.HORIZONTAL, -5, 5, 0);
		slider.setBounds(0, 682, WINDOW_LENGTH, 100);
		contentPane.add(slider);

		// Listener that changes speed based on value of the slider
		slider.addChangeListener(new ChangeListener() {
			@Override
			public void stateChanged(ChangeEvent e) {
				JSlider source = (JSlider) e.getSource();
				Screen.setSpeed(source.getValue());
			}
		});

		mob.draw();
		flock.draw();
	}

	/**
	 * This method takes in the speed from the slider and sets it for the mob.
	 * 
	 * @param val
	 *            the desired speed
	 */
	public static void setSpeed(int val) {
		speed = val;
	}

}
