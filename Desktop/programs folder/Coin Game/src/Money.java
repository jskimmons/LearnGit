
public interface Money {
	
	//random integer of dollars and cents at start of each game
	public void setRandomValue();
	
	//returns random value
	public int getRandomValue();
	
	//checks to see if the user input and the random generated values are the same
	public boolean inputValueAndRandomValueAreSame(int rand);
	
	//adds dollar or cent amount to the user input total
	public void addAdditionalValue(ValuesOfMoney value);
	
	//resets the dollar or cent amount to 0
	public void clearInputValue();
	
	//returns total of user input
	public int getInputValue();
	
}
