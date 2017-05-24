
/**
 * Generalizes the movement and drawing of objects that move on the ground (Mob
 * and StickFigure)
 * 
 * @author JoeSkimmons
 * @version 2.3
 */
public interface MovingObject {
	public void draw();

	public void translate(int xchange, int ychange);
}
