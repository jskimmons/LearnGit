import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;

/**
 * This class creates dictionary objects, which are capable
 * of converting input into the Indices of a held dictionaryList.
 * @author JoeSkimmons
 *
 */
public class Dictionary {

private String sub;
private String IndexHolder;
static ArrayList<String> dictionaryList;
private Scanner stringScanner;
private ArrayList<Integer> Indices;
private int index;
private ArrayList<String> IndicesToString;
	
	
	/**
	 * This constructs a dictionary object which holds three ArrayLists, a dictionaryList, an ArrayList of Indices,
	 * and a list of Indices to be converted back to strings. I used ArrayLists because of the ease of adding, replacing, and removing Strings and having the other 
	 * Strings shift to compensate for their new position
	 */
	public Dictionary(){
		Indices = new ArrayList<Integer>();
		dictionaryList = new ArrayList<String>();
		IndicesToString = new ArrayList<String>();
	}
	
	/**
	 * This method adds a string into the dictionary,
	 * excluding repeated words
	 * @param a, string to be added
	 */
	public void addToDictionary(String a){
		stringScanner = new Scanner(a);
		
		while(stringScanner.hasNext()){
		sub = stringScanner.next();
			if(!(dictionaryList.contains(sub))){
				dictionaryList.add(sub);
			}
		}
	}
	/**
	 * @return ArrayList dictionaryList
	 */
	public static ArrayList<String> getDictionary(){
		return dictionaryList;
	}
	
	/**
	 * This method converts a string to its given indices (in the form of a string) in the dictionaryList List.
	 * @param c string to be converted
	 * @return ArrayList Indices containing a new String with the indices of the passed String
	 */
	public ArrayList<Integer> convertToIndices(String c){
		
		stringScanner = new Scanner(c);
		while(stringScanner.hasNext()){
			IndexHolder = stringScanner.next();
				if(dictionaryList.contains(IndexHolder)){
					Indices.add(dictionaryList.indexOf(IndexHolder));
				}
				
		}
		return Indices;	
	}

	/**
	 * 
	 * @return the ArrayList indices
	 */
	public ArrayList<Integer> getIndices() {
		return Indices;
	}
	
	/**
	 * empties the Indices list
	 */
	public void clearIndices(){
		Indices.clear();
	}
	/**
	 * Takes String of integers and gives the words from the dictionaryList.
	 * @param numbersToString
	 * @return t, String of text
	 */
	public String convertIndicesBack(String numbersToString){
			String t = "";
			stringScanner = new Scanner(numbersToString);
			while(stringScanner.hasNextInt()){
				index = stringScanner.nextInt();
				t = t + dictionaryList.get(index) + " ";
			}
			
			IndicesToString.add(t);
			return t;
	}
	
	/**
	 * 
	 * @return an ArrayList of text after being turned from indices back to text
	 */
	public ArrayList<String> getStringBack(){
		return IndicesToString;
	}
	
	/**
	 * Writes the dictionary List to the file specified by the user.
	 * @param writer, FileWriter that writes to the user specified file
	 * @throws IOException
	 */
	public void setLines(FileWriter writer) throws IOException{
		
		for(String str: dictionaryList) {
			  writer.write(str + " ");
		}
	}
}

