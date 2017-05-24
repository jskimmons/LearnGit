/**
 * This class uses a builder pattern to
 * create a filter on the stream of data. It allows the user
 * to specify how they want the data filtered, or what things 
 * to be computed.
 * @author JoeSkimmons
 *
 */
public class TSVFilter {
	
	private String type;
	private String condition;
	private String fileName;
	private String computeType;
	private Command commandType;
	private long low;
	private long high;
	private String sLow;
	private String sHigh;
	private String rangeType;
	
	/**
	 * This is the constructor for a filter object, which takes in 
	 * a FilterBuilder object, per the builder pattern. The builder pattern eliminates
	 * having a constructor with too many parameters.
	 * @param filter FilterBuilder object
	 */
	public TSVFilter(FilterBuilder filter){
		this.type = filter.type;
		this.condition = filter.condition;
		this.fileName = filter.fileName;
		this.computeType = filter.computeType;
		this.commandType = filter.commandType;
		this.low = filter.low;
		this.high = filter.high;
		this.sLow = filter.sLow;
		this.sHigh = filter.sHigh;
		this.rangeType = filter.rangeType;
	}
	
	/**
	 * @return String type, the type of data to be filtered in the select method ("Name", "Age")
	 */
	public String getType(){
		return type;
	}
	
	/**
	 * @return String condition, the condition that all things must contain in the 
	 * select method to be printed ("Joe" for Name or 18 for age)
	 */
	public String getCondition(){
		return condition;
	}
	
	/**
	 * @return String fileName to be read, used in whichFile method
	 */
	public String getFileName(){
		return fileName;
	}
	
	/**
	 * @return String computeType, the type of data the compute method should be performed on (Name, Age)
	 */
	public String getComputeType(){
		return computeType;
	}
	
	/**
	 * @return Command commandType, the command to be performed in the compute method (AVG, MAX)
	 */
	public Command getCommandType(){
		return commandType;
	}
	/**
	 * @return long low, the lower bound of the range method.
	 */
	public long getLow(){
		return low;
	}
	
	/**
	 * @return long high, the upper bound of the range method.
	 */
	public long getHigh(){
		return high;
	}
	
	/**
	 * @return String sLow, the lower bound of the range method
	 */
	public String getsLow(){
		return sLow;
	}
	
	/**
	 * @return String sHigh, the upper bound of the range method
	 */
	public String getsHigh(){
		return sHigh;
	}
	
	/**
	 * @return String rangeType, the type of data to be taken into account for the range (Name, Age)
	 */
	public String getRangeType(){
		return rangeType;
	}
	
	/**
	 * This nested class is a builder for a filter object.
	 * @author JoeSkimmons
	 *
	 */
	public static class FilterBuilder{

		private String condition;
		private String type;
		private String fileName;
		private Command commandType;
		private String computeType;
		private long low;
		private long high;
		private String sLow;
		private String sHigh;
		private String rangeType;
		
		/**
		 * Constructor for the FilterBuilder, empty because the parameters
		 * are given through methods
		 */
		public FilterBuilder(){
		
		}
		
		/**
		 * The select method lets the user choose what data is written
		 * to the out-file. The method creates a FilterBuilder object
		 * that holds two parameters to filter the data, to be passed to a filter object
		 * @param type, the type of Data (Name, Age, etc)
		 * @param condition a specific piece of data to match ("joe" , 18, etc)
		 * @return a FilterBuilder object
		 */
		public FilterBuilder select(String type, String condition){
			this.type = type;
			this.condition = condition;
			return this;	
		}
		/**
		 * The default select method, filters no data
		 * @return a FilterBuilder object
		 */
		public FilterBuilder select(){
			this.type = "all";
			this.condition = "all";
			return this;
		}
		
		/**
		 * This method adds two parameters to a FilterBuilder object, allowing methods in the TSVPipeline class
		 * to compute 
		 * @param computeType the type of data to be computed (Name, Age, etc)
		 * @param commandType the command to be carried out, from Command Enum (AVG, MAX, MIN)
		 * @return a filterBuilder object
		 */
		public FilterBuilder compute(String computeType, Command commandType){
			this.computeType = computeType;
			this.commandType = commandType;
			return this;	
		}
		
		/**
		 * Range method that adds three more parameters to FilterBuilder, works for long values
		 * @param rangeType type of data desired to be within range
		 * @param low lower bound of the range of number
		 * @param high upper bound of the range of numbers
		 * @return FilterBuilder object
		 */
		public FilterBuilder range(String rangeType, long low, long high){
			this.rangeType = rangeType;
			this.low = low;
			this.high = high;
			return this;
		}
		
		/**
		 * Range method, works for string values. Filters our data that doesn't fall in its range of given Strings alphabetically,
		 * not inclusive on upper bound
		 * @param rangeType type of data desired to be within range
		 * @param sLow lower bound of the string range
		 * @param sHigh upper bound of the string range
		 * @return FilterBuilder object
		 */
		public FilterBuilder range(String rangeType, String sLow, String sHigh){
			this.rangeType = rangeType;
			this.sLow = sLow;
			this.sHigh = sHigh;
			return this;
		}
		
		/**
		 * default range method, doesn't filter data
		 * @return FilterBuilder object
		 */
		public FilterBuilder range(){
			this.rangeType = "all";
			this.sLow = "none";
			this.sHigh = "none";
			this.low = -1;
			this.high = -1;
			return this;
		}
		
		/**
		 * specifies which file data is read from
		 * @param fileName
		 * @return FilterBuilder object
		 */
		public FilterBuilder whichFile(String fileName){
			this.fileName = fileName;
			return this;
		}
		
		/**
		 * Builds a FilterBuilder object
		 * @return a Filter Object, per the builder pattern
		 */
		public TSVFilter build(){
			return new TSVFilter(this);
		}
		
	}
	
}
