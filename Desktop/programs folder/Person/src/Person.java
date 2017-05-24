
public class Person {

	private int age;
	private String name;
	
	
	public Person(int a, String n) {
		
		age = a;
		name = n;
		
		
	}
	
	public Person(){
		name = null;
		age = 0;
	}

	public String getName(){
		return name;
	}
	
	public int getAge(){
		return age;
	}
	
	public void setName(String n1){
		name = n1;
	}
	
	public void setAge(int a1){
		age = a1;
	}
	public String toString(){
		return "Name: " + this.getName() + " " + "Age: " + this.getAge();
	}
}