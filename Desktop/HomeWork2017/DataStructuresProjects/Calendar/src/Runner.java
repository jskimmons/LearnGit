import java.io.IOException;

/**
 * Created by JoeSkimmons on 1/29/17.
 */
public class Runner {

    public static void main(String[] args) throws IOException {
        InputFile input = new InputFile("classOutput.txt");

        input.readFile();
    }
}
