import java.util.Scanner;
public class Talker {
	
	private String voice;
	public Talker(){
		Scanner s = new Scanner(System.in);
		System.out.println("Please enter your throw.");
		voice = s.nextLine();
	}
	
	public String getVoice(){
		return voice;
	}

}
