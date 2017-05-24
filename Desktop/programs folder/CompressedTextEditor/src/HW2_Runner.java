import java.io.IOException;

public class HW2_Runner {

	public static void main(String[] args) throws IOException {
	
	//Editor text = new Editor();
	//text.runEditor();
	Dictionary d = new Dictionary();
	String str = "one one two three three four";
	d.addToDictionary(str);
	System.out.println(d.getDictionary());
	d.convertToIndicies(str);
	System.out.println(d.getIndicies());
	
	}
}
