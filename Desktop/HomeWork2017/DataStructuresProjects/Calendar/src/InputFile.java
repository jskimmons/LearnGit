import java.io.IOException;
import java.nio.file.Files;
import java.util.stream.Stream;

import static java.nio.file.Paths.get;

/**
 * Created by JoeSkimmons on 1/29/17.
 */
public class InputFile {

    private String fileName;

    public InputFile(String fileName) {
        this.fileName = fileName;
    }

    public void readFile(){
        try (Stream<String> stream = Files.lines(get(fileName))) {
            stream.forEach(System.out::println);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

