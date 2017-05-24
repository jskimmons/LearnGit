import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

/**
 * Created by JoeSkimmons on 2/2/17.
 */
public class FileManager {

    private String fileName;
    private ArrayList<String> file;
    private int cursor;

    public FileManager(){
        cursor = 0;
	    this.file = new ArrayList<>();
    }

    public void WriteFile (String fileName) {

        this.fileName = fileName;
        FileWriter fw = null;
        BufferedWriter bw = null;

        try {
	    file = new ArrayList<>();
            fw = new FileWriter(fileName);
            bw = new BufferedWriter(fw);
            //bw.write();

        } catch (IOException e) {
        e.printStackTrace();
	System.out.println("File not found");
        }
    }

    public void moveCursorUp(){
	    cursor++;
    }

    public void moveCursorDown(){
	    cursor--;
    }

    public void insertLine(String content){
	    this.file.add(cursor, content);
	    cursor++;
    }

    public void deleteLine(){
	    this.file.remove(cursor-1);
    }

    public void printCurrentLine(){
	    System.out.println(this.file.get(cursor-1));
    }

    public void printEntireFile(){
	    for(String phrase : file){
	    	System.out.println(phrase);
	    }
    }

    public String getCurrentLine(){
        return this.file.get(cursor-1);
    }


    public void replaceLine(String content){
	    this.file.set(cursor-1, content);
    }

    public void saveFile(String whatever){

    }

    public void loadFile(String whatever){

    }


}
