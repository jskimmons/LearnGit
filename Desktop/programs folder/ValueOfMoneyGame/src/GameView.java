import java.awt.BorderLayout;
import java.awt.EventQueue;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JTextField;

public class GameView extends JFrame implements ActionListener{

	
	private static final long serialVersionUID = 1L;
	private JPanel contentPane;
	private Coin coin;
	private JTextField displayRand;
	private JTextField displayInput;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
					GameView frame = new GameView();
					frame.setVisible(true);
			}
		});
	}

	/**
	 * Create the frame.
	 */
	public GameView() {
		coin = new Coin();
		coin.setRandomValue();
		
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(200, 200, 900, 600);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JPanel panel = new JPanel();
		panel.setBounds(229, 5, 666, 568);
		contentPane.add(panel);
		panel.setLayout(null);
		
		JButton btnPenny = new JButton("Penny");
		btnPenny.setBounds(141, 61, 117, 29);
		panel.add(btnPenny);
		
		JButton btnQuarter = new JButton("Quarter");
		btnQuarter.setBounds(530, 61, 117, 29);
		panel.add(btnQuarter);
		
		JButton btnNickel = new JButton("Nickel");
		btnNickel.setBounds(274, 61, 117, 29);
		panel.add(btnNickel);
		
		JButton btnDime = new JButton("Dime");
		btnDime.setBounds(403, 61, 117, 29);
		panel.add(btnDime);
		
		ImageIcon quarterImage = new ImageIcon("/Users/JoeSkimmons/Desktop/programs folder/ValueOfMoneyGame/bin/Quarter.jpg");
		
		
		displayRand = new JTextField();
		displayRand.setBounds(233, 131, 294, 43);
		this.resetRandomValue();
		panel.add(displayRand);
		displayRand.setColumns(10);
		
		displayInput = new JTextField();
		displayInput.setBounds(233, 186, 294, 43);
		panel.add(displayInput);
		displayInput.setColumns(10);
		
		JButton btnClear = new JButton("Clear");
		btnClear.setBounds(410, 274, 117, 29);
		panel.add(btnClear);
		
		JButton btnSubmit = new JButton("Submit");
		btnSubmit.setBounds(233, 274, 117, 29);
		panel.add(btnSubmit);
		JLabel imagelabel = new JLabel(quarterImage);
		imagelabel.setBounds(-10, 0, 227, 568);
		contentPane.add(imagelabel);
		
		
		btnPenny.addActionListener(e->this.buttonSelectedAdd(ValuesOfMoney.PENNY));
				
		btnNickel.addActionListener(e->this.buttonSelectedAdd(ValuesOfMoney.NICKEL));
		
		btnDime.addActionListener(e->this.buttonSelectedAdd(ValuesOfMoney.DIME));
		
		btnQuarter.addActionListener(e->this.buttonSelectedAdd(ValuesOfMoney.QUARTER));
		
		btnClear.addActionListener(e->this.clearSelected());
		
		btnSubmit.addActionListener(e->this.submitSelected());

	
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		// TODO Auto-generated method stub
		
	}
	
	public void buttonSelectedAdd(ValuesOfMoney value){
		coin.addAdditionalValue(value);
		displayInput.setText("Current Value: " + coin.getInputValue() + " cents");
	}
	
	public void clearSelected(){
		coin.clearInputValue();
		displayInput.setText("");
	}
	
	public void submitSelected(){
		if(coin.inputValueAndRandomValueAreSame(coin.getRandomValue())){
			coin.clearInputValue();
			displayInput.setText("Congratulations!");
			this.resetRandomValue();
			
			
		}
		else{
			coin.clearInputValue();
			displayInput.setText("Try Again!");
		}
		
	}
	
	public void resetRandomValue(){
		coin.setRandomValue();
		displayRand.setText("Create this value: " + coin.getRandomValue() + " cents");
		
	}
}
