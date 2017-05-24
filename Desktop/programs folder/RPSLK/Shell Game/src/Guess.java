import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.*;
public class Guess extends JFrame
{
	private static int WIDTH = 750;
    private static int HEIGHT = 460;
    private static int[] count = new int[256];
    private int currentNumber;
    private int amtOfTries;
    private Random myGen;
 
    private int row = 10;
    private int col = 20;
    private int counter=0;
 
    private JTextField lineTF=new JTextField(20);
    private JTextArea conversionTA;
    private JButton exitB, encryptB, decryptB;
    private JButton button0, button1, button2;
    private JButton startGame;
    private ButtonEventHandler eventHandler;
    private Color cc = new Color(94,99,231);
 
    public Guess()
    {
     setTitle("The Shell Game...");
     setSize(WIDTH,HEIGHT);
 
 
     myGen = new Random();
     currentNumber=myGen.nextInt(3);
 
     Container pane=getContentPane();
 
     conversionTA=new JTextArea(row,col);
     exitB=new JButton("Exit");
     button0=new JButton("0");
     button1=new JButton("1");
     button2=new JButton("2");
     startGame=new JButton("Start New Game");
 
     eventHandler=new ButtonEventHandler();
     exitB.addActionListener(eventHandler);
     button0.addActionListener(eventHandler);
     button1.addActionListener(eventHandler);
     button2.addActionListener(eventHandler);
     startGame.addActionListener(eventHandler);
 
      //set the layout of the pane to null
      pane.setLayout(null);
 
      //set the locations of the GUI components
      //lineTF.setLocation(20, 50);
      conversionTA.setLocation(320, 10);
      button0.setLocation(20, 100);
      button1.setLocation(120, 100);
      button2.setLocation(240, 100);
      exitB.setLocation(40, 140);
      startGame.setLocation(20, 190);
 
      //set the sizes of the GUI components
      //lineTF.setSize(200, 30);
      conversionTA.setSize(400, 400);
      button0.setSize(60, 30);
      button1.setSize(60, 30);
      button2.setSize(60, 30);
      startGame.setSize(270, 30);
      exitB.setSize(200, 30);
 
      //Set the button pictures using this code...
      //Image myImage6 = getToolkit().createImage("one.JPG");
      //ImageIcon myIcon6 = new ImageIcon(myImage6);
         //o.setIcon(myIcon6);
 
      //add components to the pane
      //pane.add(lineTF);
      pane.add(conversionTA);
      pane.add(button0);
      pane.add(button1);
      pane.add(button2);
      pane.add(startGame);
      pane.add(exitB);
      pane.setBackground(cc);
 
      setVisible(true);
      conversionTA.setLineWrap(true);
      setDefaultCloseOperation(EXIT_ON_CLOSE);
    } //end of the constructor
 
 
    private class ButtonEventHandler implements ActionListener
    {
 
 
        public void actionPerformed(ActionEvent e)
        {
 
            if (e.getActionCommand().equals("0"))
            {
 
                if (currentNumber == 0) {
                    JOptionPane.showMessageDialog(new JFrame(), "Correct Guess! - New Game Started", "Correct Guess", JOptionPane.ERROR_MESSAGE);
                    amtOfTries++;
                    String s = "Amount of tries: " + amtOfTries;
                    conversionTA.setText(s);
                    amtOfTries=0;
                    currentNumber=myGen.nextInt(3);
                }
                else {
                    Image myImage6 = getToolkit().createImage("x-300.PNG");
                    ImageIcon myIcon6 = new ImageIcon(myImage6);
                    button0.setIcon(myIcon6);
 
                    JOptionPane.showMessageDialog(new JFrame(), "InCorrect Guess! - Try Again", "InCorrect Guess", JOptionPane.ERROR_MESSAGE);
                    amtOfTries++;
                }
 
 
            }
            if (e.getActionCommand().equals("1"))
            {
                if (currentNumber == 1) {
                    JOptionPane.showMessageDialog(new JFrame(), "Correct Guess! - New Game Started", "Correct Guess", JOptionPane.ERROR_MESSAGE);
                    amtOfTries++;
                    String s = "Amount of tries: " + amtOfTries;
                    conversionTA.setText(s);
                    amtOfTries=0;
                    currentNumber=myGen.nextInt(3);
                }
                else {
                    JOptionPane.showMessageDialog(new JFrame(), "InCorrect Guess! - Try Again", "InCorrect Guess", JOptionPane.ERROR_MESSAGE);
                    amtOfTries++;
                }
 
 
            }
            if (e.getActionCommand().equals("2"))
            {
                if (currentNumber == 2) {
                    JOptionPane.showMessageDialog(new JFrame(), "Correct Guess! - New Game Started", "Correct Guess", JOptionPane.ERROR_MESSAGE);
                    amtOfTries++;
                    String s = "Amount of tries: " + amtOfTries;
                    conversionTA.setText(s);
                    amtOfTries=0;
                    currentNumber=myGen.nextInt(3);
                }
                else {
                    JOptionPane.showMessageDialog(new JFrame(), "InCorrect Guess! - Try Again", "InCorrect Guess", JOptionPane.ERROR_MESSAGE);
                    amtOfTries++;
                }
 
 
            }
 
            if (e.getActionCommand().equals("Start New Game"))
            {
                //conversionTA.setText("");
                String s = "Amount of tries: " + amtOfTries + " and number was: " + currentNumber;
                conversionTA.setText(s);
                amtOfTries=0;
                currentNumber=myGen.nextInt(3);
                JOptionPane.showMessageDialog(new JFrame(), "New Game Started - Start Guessing", "New Game Started - Start Guessing", JOptionPane.ERROR_MESSAGE);
            }
            else if (e.getActionCommand().equals("Exit"))
                 System.exit(0);
        }
    }
 
 
}