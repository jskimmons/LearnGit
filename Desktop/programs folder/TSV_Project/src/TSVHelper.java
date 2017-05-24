import java.util.Scanner;
/**
 * This class helps the TSVPipeline class by holding the
 * methods determining if lines are correctly formatted, 
 * contain the condition being selected, or
 * are in range. 
 * @author JoeSkimmons, jws2191
 *
 */
public class TSVHelper {

	private Scanner streamRead;
	private TSVFilter filter;

	public TSVHelper(TSVFilter filter) {
		this.filter = filter;
	}
	
	/**
	 * Instantiates the type array and determines if values are longs
	 * or strings based on if they can be converted to longs
	 * @exception NumberFormatException caught if a string cannot be converted to a long
	 */
	public void determineTypes(){
		
		TSVPipeline.type = new int[TSVPipeline.typeLine.size()];
		
		for(int x=0; x<TSVPipeline.typeLine.size(); x++){
			try{
				Long.parseLong(TSVPipeline.typeLine.get(x));
				TSVPipeline.type[x] = 0;
			}
			catch (NumberFormatException e){
				TSVPipeline.type[x] = 1;
			}
		}
	}
	
	 /**
	  * Checks if each line holds proper type and number of elements based on the type array
	  * and headerLine arrayList
	  * @param line line to be checked
	  * @return true if line is properly formatted, if not returns false
	  */
	public boolean isLineFormatted(String line){
		
		streamRead = new Scanner(line);

		int x=0;
		
		while(streamRead.hasNext()){
			try{
				try{
					Long.parseLong(streamRead.next());	
					if(TSVPipeline.type[x]==1){
						return false;
					}		
				}
				catch (NumberFormatException e){
						if(TSVPipeline.type[x]==0){
							return false;
						}
				}
				x++;
			}
			catch(ArrayIndexOutOfBoundsException f){
				return false;
			}
		}
		if(x<TSVPipeline.type.length){
			return false;
		}
		return true;
	}
	
	/**
	 * Check if line contains condition specified by the filter object and given in the
	 * select method
	 * @param line to be checked
	 * @return true if line contains condition, or else returns false
	 */
	public boolean containsCondition(String line){
		
		streamRead = new Scanner(line);
		int x=0;
		
		if(filter.getType().equals("all")){
			return true;
		}
		if(TSVPipeline.headerLine.indexOf(filter.getType())<0){
			System.out.println("Not a valid Condition");
			return false;
		}
		while(streamRead.hasNext()){
			String word = streamRead.next();
			if(TSVPipeline.headerLine.indexOf(filter.getType())==x){
				if(filter.getCondition().equals(word)){
					return true;
				}
			}
		x++;
		}
		return false;
	}
	
	/**
	 * checks if the proper element in a line is in the range specified by the
	 * filter object and range method.
	 * @param line line to be checked
	 * @return true if in range, or else false
	 */
	public boolean inRange(String line){
		
		streamRead = new Scanner(line);
		
		if(filter.getRangeType().equals("all") && filter.getsLow().equals("none")){
			return true;
		}
		if(TSVPipeline.headerLine.indexOf(filter.getRangeType())<0){
			System.out.println("Not a valid Range Condition");
			return false;
		}
			int x=0;
			while(streamRead.hasNext()){
					String word = streamRead.next();
					if(TSVPipeline.headerLine.indexOf(filter.getRangeType())==x){
						if(TSVPipeline.type[x]==1){
							if(filter.getsLow().compareTo(word)<=0 && filter.getsHigh().compareTo(word)>=0){
								return true;
							}
						}
						else{
							long y = Long.parseLong(word);
							if(TSVPipeline.headerLine.indexOf(filter.getRangeType())==x){
								if((filter.getLow() <= y)&&(filter.getHigh() >= y)){
									return true;
								}
							}
						}
					}
				x++;
			}
		return false;	
	}
}
