
public enum ValuesOfMoney {

	PENNY(1), NICKEL(5), DIME(10), QUARTER(25);
	private int value;
	
	private ValuesOfMoney(int value){
		this.value = value;
	}
	
	public int getValue(){
		return value;
	}

	/**
	 * public static void main (String[] args) {
		for (ValuesOfMoney v : ValuesOfMoney.values())
		System.out.println("Value: " + v.getValue() + " Name: " + v);
	}
	 **/
}
