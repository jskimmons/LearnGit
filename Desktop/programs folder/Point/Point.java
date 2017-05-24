
public class Point {

	private static int height;
	private static int length;
	
	public Point(){
		height = 0;
		length = 0;
	}
	
	public Point(int x,int y){
		height = y;
		length =x;
	}

	public static void print(){
		System.out.println(height);
		System.out.println(length);
	}
}
