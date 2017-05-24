import javax.swing.*;
import java.awt.*;

public class ExampleJFrame {

	public static void main(String[] args){
		
		JFrame myFrame = new JFrame("TEST");
		//JTextField myTextField = new JTextField(20);
		//JButton yesButton = new JButton("Press yes to say yes!");
		//JButton noButton = new JButton("Presss no to say no!");
		//yesButton.addActionListener(ae -> myTextField.setText("YES"));
		//noButton.addActionListener(ae -> myTextField.setText("NO"));
		
		//myFrame.setLayout(new FlowLayout());
		
		//myFrame.add(myTextField);
		//myFrame.add(yesButton);
		//myFrame.add(noButton);
		
		myFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		myFrame.pack();
		myFrame.setVisible(true);
	
	}

}
