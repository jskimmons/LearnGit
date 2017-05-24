import java.awt.Color;
import java.awt.Frame;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
public class SampleFrame {

	public static void main(String [ ] args){
	    Frame mainFrame = new Frame("joe");
		mainFrame.setSize(400,400);
	    mainFrame.setVisible(true);
	    mainFrame.setBackground(Color.blue);
	    mainFrame.addWindowListener ( new WindowAdapter () {
			public void windowClosing ( WindowEvent evt )
			{
				System.exit(0);
			}
		});

	    
	}
	
}
