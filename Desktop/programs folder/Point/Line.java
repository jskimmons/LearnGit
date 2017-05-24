
public class Line extends Point{

	private int distance;
	private int slope;
	
	public Line(int d, int s, int x, int y){
		super(x, y);
		distance = d;
		slope = s;
	}
}
