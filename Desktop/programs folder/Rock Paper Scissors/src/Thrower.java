
public class Thrower {
	private String[] THROWS = {"r","p","s"};
	private int random;
	public Thrower(){
		random = (int)(Math.random() * THROWS.length);
	}
	
	public String getThrow(){
		return THROWS[random];
	}
}