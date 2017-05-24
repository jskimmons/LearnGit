
public class Computer {
	private String[] THROWS = {"r","p","s"};
	private int random;
	public Computer(){
		random = (int)(Math.random() * THROWS.length);
	}
	
	public String getThrow(){
		return THROWS[random];
	}
}