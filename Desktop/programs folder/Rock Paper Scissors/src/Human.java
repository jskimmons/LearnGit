import java.util.Scanner;
public class Human {
	
	private String voice;
	
	public Human(){
		Scanner s = new Scanner(System.in);
		System.out.println("Please enter your throw.");
		voice = s.nextLine();
	}
	
	public String getVoice(){
		return voice;
	}

}
