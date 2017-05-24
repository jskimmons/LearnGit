import java.util.ArrayList;
import java.util.Scanner;

public class Dictionary {

private String sub;
private String IndexHolder;
private static ArrayList<String> dictionaryList;
private Scanner s;
private ArrayList<Integer> indicies;
	
	public Dictionary(){
		dictionaryList = new ArrayList<String>();
		indicies = new ArrayList<Integer>();
	}
	
	public void addToDictionary(String a){
		s = new Scanner(a);
		
		while(s.hasNext()){
		sub = s.next();
			if(!(dictionaryList.contains(sub)))
				dictionaryList.add(sub);
		}
	}
	
	public ArrayList<String> getDictionary(){
		return dictionaryList;
	}
	
	public void convertToIndicies(String c){
		
		s = new Scanner(c);
		while(s.hasNext()){
			IndexHolder = s.next();
			System.out.println(IndexHolder);
				if(dictionaryList.contains(IndexHolder)){
					System.out.println(dictionaryList.contains(IndexHolder));
					System.out.println(dictionaryList.indexOf(IndexHolder));
					indicies.add(dictionaryList.indexOf(IndexHolder));
				}
				
		}	
	}
	public ArrayList<Integer> getIndicies(){
		return indicies;
	}
}
