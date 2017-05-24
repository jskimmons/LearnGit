import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class CommandLibrary{

private FileWriter fw;
private File file;
private LineTool linetool;
static String[] POSSIBLE_COMMANDS = {"g","p","c","i","r","d","^","v","s","q"};

	public CommandLibrary(){
		linetool = new LineTool();
	}
	public void commandG(String f) throws IOException{
	
		if(f.length()!=0){
			if(!(f.endsWith(".txt"))){
				f = f + ".txt";
			}
		}
		
		file = new File(f);
		if(file.exists()){
			fw = new FileWriter(f, true);
			System.out.println("Previously existing file \n" + "Begin Editing");
		}
		else{
			file.createNewFile();
			fw = new FileWriter(f);
		}
		linetool.readLines(f);
	}
	
	public void emptyCommandG() throws IOException{
		
	}
	
	public void commandS(String f) throws IOException{
		if(f.length()!=0){
			if(!(f.endsWith(".txt"))){
				f = f + ".txt";
			}
		}
		
		file = new File(f);
		if(file.exists()){
			fw = new FileWriter(f, true);
			System.out.println("File written, thank you!");
		}
		else{
			file.createNewFile();
			fw = new FileWriter(f);
			System.out.println("File written, thank you!");
		}
		linetool.setLines(fw);	
	}
	
	public void emptyCommandS() throws IOException{
		linetool.setLines(fw);
		fw.close();
	}
	public void commandI(String t) throws IOException{
		
		linetool.addLine(t + "\n");
		//fw.write(t + "\n");	
		//System.out.println(linetool.getArrayList());
	}
	
	public void commandD(){
		linetool.deleteLastLine();
	}
	
	public void commandP(){
		for(int x=0;x<linetool.getArrayList().size();x++){
			System.out.println(linetool.getArrayList().get(x));
		}
	}
	
	public void commandC(){
		System.out.println(linetool.getArrayList().get(LineTool.currentLine));
	}
	
	public void moveUpLine(){
		//if(LineTool.currentLine!=linetool.getArrayList().size())
			LineTool.currentLine--;
	}
	
	public void moveDownLine(){
		//if(LineTool.currentLine!=linetool.getArrayList().size( ))
			LineTool.currentLine++;
	}
	public void commandR(String r) {
		linetool.getArrayList().set(LineTool.currentLine, r);
	}
	public void commandQ() {
		Editor.endEditor = true;
	}
}