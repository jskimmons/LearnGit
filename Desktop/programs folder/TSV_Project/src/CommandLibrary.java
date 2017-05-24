import java.util.Scanner;

/**
 * This class handles each command from the Command Enumerator, holding their logic
 * and data.
 * @author JoeSkimmons, jws2191
 *
 */
public class CommandLibrary {

	private long maxValue;
	private long minValue;
	private double avgValue;
	private String maxString;
	private String minString;
	private long sumValue;
	private int count;
	private Scanner read;
	private boolean string;
	
	/**
	 * Constructor for each object, sets initial value for 
	 * their ease of use when commands are called
	 */
	public CommandLibrary(){
		maxValue = Integer.MIN_VALUE;
		minValue = Integer.MAX_VALUE;
		maxString = "z";
		minString = "";
	}
	
	/**
	 * This method chooses the word in the file that the command will be acted on, and passes it to
	 * the method that performs the command
	 * @param arg Type of data to be acted on (Name, age)
	 * @param command action to be taken on the data type (MAX, MIN)
	 * @param line line of the file currently being processed
	 */
	public void setUpCommand(String arg, Command command, String line){
		int x=0;
		read = new Scanner(line);
		
		while(read.hasNext()){
			String word = read.next();
			if(TSVPipeline.headerLine.indexOf(arg)==x){
				this.runCommand(command, x, word);
			}
		x++;
		}
	}
	
	/**
	 * Performs command on specific word/data type
	 * @param arg data type acted on (MAX, MIN, AVG)
	 * @param x position of word in line
	 * @param word data being acted on ("Joe" 18)
	 */
	public void runCommand(Command arg, int x, String word){
		switch (arg){
		case MAX:{
			if(TSVPipeline.type[x]==0){
				string = false;
				long v = Long.parseLong(word);
				if(v>maxValue)
					maxValue = v;
			}
			else{
				string = true;
				if(word.compareTo(maxString)<0){
					maxString = word;
				}
			}
		}
		case MIN:{
			if(TSVPipeline.type[x]==0){
				string = false;
				long v = Long.parseLong(word);
				if(v<minValue)
					minValue = v;
			}
			else{
				string = true;
				if(minString.compareTo(word)<0){
					minString = word;
				}
			}
		}
		case SUM:{
			if(TSVPipeline.type[x]==0){
				string = false;
				long v = Long.parseLong(word);
				sumValue = v + sumValue;
			}
			else{
				string = true;
			}
		}
		case COUNT:{
			count++;
		}
		case AVG:{
			if(TSVPipeline.type[x]==0){
				string = false;
				long v = Long.parseLong(word);
				sumValue = v + sumValue;
				count++;
			}
			else{
				string = true;
			}
		}
		}
		if(count==0) avgValue=0;
		else avgValue = sumValue/count;
	}
	/**
	 * Prints value returned by the command to the console
	 * @param command Command chosen by the user
	 */
	public void printVals(Command command){
			if(command.equals(Command.MAX)){
				if(string)
					System.out.println("Max: " + maxString);
				else
					System.out.println("Max: " + maxValue);
			}
			if(command.equals(Command.MIN)){
				if(string)
					System.out.println("Min: " + minString);
				else
					System.out.println("Min: " + minValue);	
			}
			if(command.equals(Command.SUM)){
				if(string)
					System.out.println("Operation invalid for Strings");
				else
					System.out.println("Sum: " + sumValue);
			}
			if(command.equals(Command.COUNT)){
				System.out.println("Number of records: " + count);
			}
			if(command.equals(Command.AVG)){
				if(string)
					System.out.println("Invalid operation for string");
				else{
					System.out.println("Average " + command + ": " + avgValue);
				}
			}
		}
}
