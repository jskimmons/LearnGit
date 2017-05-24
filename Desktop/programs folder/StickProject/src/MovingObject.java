import java.awt.Graphics2D;

public interface MovingObject {
	void draw(Graphics2D g2);
	void translate(int xchange, int ychange);	
}
