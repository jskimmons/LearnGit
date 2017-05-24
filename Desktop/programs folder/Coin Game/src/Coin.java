
public class Coin implements Money {

	private int randomCoinValue;
	private int inputValue;
	
	@Override
	public void setRandomValue() {
		randomCoinValue = (int) (Math.random()*100);
	}

	@Override
	public int getRandomValue() {
		return randomCoinValue;
	}
	
	@Override
	public boolean inputValueAndRandomValueAreSame(int rand) {
		if(rand == inputValue)
			return true;
		return false;
	}

	@Override
	public void addAdditionalValue(ValuesOfMoney value) {
		inputValue += value.getValue();
		
	}

	@Override
	public void clearInputValue() {
		inputValue = 0;
	}
	
	@Override
	public int getInputValue() {
		
		return inputValue;
	}
}