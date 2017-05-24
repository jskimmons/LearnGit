import java.util.Scanner;

public class Lexo {

	private String input;
	private static Scanner s;
	public static void main(String[] args) {
		
		s = new Scanner(System.in);
		System.out.println("Who we talkin here?");
		String input = s.nextLine();
		
		while(!(input.equals("lexo"))){
			System.out.println("Speak yo mind bruh");
			input = s.nextLine();
		}
		
		
		System.out.println("he a bitch");
		
		System.out.println("he still playin like he know shit?");
		input = s.nextLine();
		while(!(input.equals("you know it bro"))){
			System.out.println("Speak yo mind bruh");
			input = s.nextLine();
		}
		
		System.out.println("man is he a bitch");
}
}