public class GenericsTest<T>{
	private T box;
	public GenericsTest(T element){
		box = element;
	}
	public T getElement(){
		return box;
	}
	public static <E> void printElement(E element){
		System.out.println(element);
	}
	
	public static void main(String[] args){
	
		GenericsTest<Integer> box = new GenericsTest<>(5);
		System.out.println(box.getElement());
		GenericsTest.printElement("TEST");
	}
}
