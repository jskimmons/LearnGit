import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;

public class LineTool {
	
	private ArrayList<String> lines;
	static int currentLine;
	
	public LineTool(){
		lines = new ArrayList<String>();
	}
	public void addLine(String l){
		lines.add(l);
		currentLine = lines.size()-1;
		System.out.println(currentLine);
	}
	public ArrayList<String> getArrayList(){
		return lines;
	}
	
	public void readLines(String f) throws FileNotFoundException{
		Scanner s = new Scanner(new File(f));
		while (s.hasNextLine()){
		    lines.add(s.nextLine());
		}
		s.close();
		currentLine = lines.size()-1;
	}
	
	public void setLines(FileWriter writer) throws IOException{
		
		for(String str: lines) {
			  writer.write(str);
			}
			writer.close();
	}
	
	public void deleteLastLine(){
		lines.remove(currentLine);
		currentLine = lines.size()-1;
	}

	public int getCurrentLine() {
		return currentLine;
	}
}
