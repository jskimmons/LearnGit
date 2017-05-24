/**
 * Created by JoeSkimmons on 2/2/17.
 */
public class Tester {
    public static void main(String[] args) {
       	Talker talk = new Talker();
		FileEditor fe = new FileEditor(talk);
		fe.start();
    }
}
