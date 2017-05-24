import java.awt.Component;
import java.awt.Graphics;

public interface Icon{
	void paintIcon(Component c, Graphics g, int x, int y);
	int getIconWidth();
	int getIconHeight();
}

