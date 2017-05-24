import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.font.FontRenderContext;
import java.awt.geom.Rectangle2D;

/**
 * Class that creates throwObjects to be painted on the GUI
 * 
 * @author JoeSkimmons, jws2191
 * @version 2.5
 */
public class throwObject {

	/**
	 * Font that throwName is painted in
	 */
	private Font throwFont;
	/**
	 * String to be painted on the GUI
	 */
	private String throwName;
	/**
	 * XYInfo object to determine position and velocity of throwObject
	 */
	private XYInfo info;
	/**
	 * rectangle that is used to detect collisions
	 */
	private Rectangle2D throwRectangle;
	/**
	 * Name of font of throwNmae
	 */
	private String fontName;
	/**
	 * Size of font of throwSize
	 */
	private int fontSize;
	/**
	 * Context that sets size of rectangle
	 */
	FontRenderContext throwContext;

	/**
	 * Creates a throwObject
	 * 
	 * @param name
	 *            String to be painted
	 * @param fontName
	 *            Font Name of string
	 * @param fontSize
	 *            Font size of string
	 * @param info
	 *            XYInfo object
	 * @param g2D
	 *            graphics object
	 */
	public throwObject(String name, String fontName, int fontSize, XYInfo info, Graphics2D g2D) {
		this.throwName = name;
		this.fontName = fontName;
		this.fontSize = fontSize;
		this.throwFont = new Font(fontName, Font.BOLD, fontSize);
		this.info = info;

		throwContext = g2D.getFontRenderContext();
		throwRectangle = throwFont.getStringBounds(throwName, throwContext);
		throwRectangle.setFrame(info.getxPosition(), info.getyPosition(), throwRectangle.getWidth(),
				throwRectangle.getHeight());
	}

	/**
	 * @return Font object
	 */
	public Font getThrowFont() {
		return throwFont;
	}

	/**
	 * @return throwName
	 */
	public String getThrowName() {
		return throwName;
	}

	/**
	 * @return throwRectangle
	 */
	public Rectangle2D getThrowRectangle() {
		return throwRectangle;
	}

	/**
	 * @return XYInfo info object
	 */
	public XYInfo getXYInfo() {
		return info;
	}

	/**
	 * @return X Position
	 */
	public int getxPosition() {
		return this.getXYInfo().getxPosition();
	}

	/**
	 * @return Y Position
	 */
	public int getyPosition() {
		return this.getXYInfo().getyPosition();
	}

	/**
	 * @return X Velocity
	 */
	public int getxVelocity() {
		return this.getXYInfo().getxVelocity();
	}

	/**
	 * @return Y Velocity
	 */
	public int getyVelocity() {
		return this.getXYInfo().getyVelocity();
	}

	/**
	 * Sets a new rectangle position
	 * 
	 * @param xPos
	 *            desired X Position
	 * @param yPos
	 *            desired Y Position
	 */
	public void setRectLocation(int xPos, int yPos) {
		throwRectangle.setFrame(xPos, yPos, throwRectangle.getWidth(), throwRectangle.getHeight());
	}

	/**
	 * Sets throwName for a throwObject
	 * 
	 * @param name
	 *            new String to be painted
	 */
	public void setThrowName(String name) {
		this.throwName = name;

	}

	/**
	 * Increments the size of Font of throwName
	 * 
	 * @param i
	 *            amount of increase in fontSize
	 */
	public void setFontSize(int i) {
		throwFont = new Font(fontName, Font.BOLD, fontSize += i);
		throwRectangle = throwFont.getStringBounds(throwName, throwContext);
		throwRectangle.setFrame(info.getxPosition(), info.getyPosition(), throwRectangle.getWidth(),
				throwRectangle.getHeight());
	}

	/**
	 * @return fontSize
	 */
	public int getFontSize() {
		return fontSize;
	}
}
