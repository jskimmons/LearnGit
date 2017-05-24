import java.io.FileNotFoundException;
import java.util.Scanner;

/**
 * Created by JoeSkimmons on 5/8/17.
 */
public class exceptions {
    public static void main(String[] args) {
        Scanner reader = new Scanner(System.in);  // Reading from System.in
        System.out.println("Enter a number over 100: ");
        int n = reader.nextInt(); // Scans the next token of the input as an int.
        if (n < 100) {
            throw new IllegalArgumentException("MUST BE OVER 100");
        }
    }
}
