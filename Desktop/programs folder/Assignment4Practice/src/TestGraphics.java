import java.awt.Component;
import java.awt.Container;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.geom.*;

import javax.swing.JFrame;
import javax.swing.JPanel;

import com.sun.javafx.geom.Line2D;

public class TestGraphics extends JFrame{
		
	private DrawCanvas canvas;
	private static final int UNIT = 1;
	private static final int WINDOW_HEIGHT = 6*UNIT;
	private static final int WINDOW_LENGTH = 2*UNIT;
		
	public TestGraphics(){
		canvas = new DrawCanvas();
		
		Container cp = getContentPane();
	      cp.add(canvas);
	      
	      setDefaultCloseOperation(EXIT_ON_CLOSE);
	      setSize(WINDOW_LENGTH,WINDOW_HEIGHT);
	      setVisible(true);
	}
		
	public class DrawCanvas extends JPanel{
		
		private GeneralPath gp;
		
			public void paintComponent(Graphics g){
				super.paintComponent(g);
				Graphics2D g2 = (Graphics2D)g;
				
				gp = new GeneralPath();
				gp.append(new Ellipse2D.Float(0,0,2*UNIT,2*UNIT),true);
				gp.moveTo(WINDOW_LENGTH/2, UNIT*2);
				gp.lineTo(WINDOW_LENGTH/2, UNIT*4);
				gp.lineTo(WINDOW_LENGTH, WINDOW_HEIGHT);
				gp.moveTo(WINDOW_LENGTH/2, UNIT*4);
				gp.lineTo(0, WINDOW_HEIGHT);
				gp.moveTo(WINDOW_LENGTH/2, UNIT*3);
				gp.lineTo(WINDOW_LENGTH, UNIT*2);
				gp.moveTo(WINDOW_LENGTH/2, UNIT*3);
				gp.lineTo(0, UNIT*2);
				gp.closePath();
				g2.draw(gp);
			}
		}
		
		
		public static void main(String[]args){
			
			new TestGraphics();
			
			
			
		}
	}
