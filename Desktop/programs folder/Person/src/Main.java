
public class Main {

	public static void main(String[] args) {
		
		String[] VERBS_ROW_1 = {"ties", "covers", "crushes", "vaporizes", "crushes"};
		String[] VERBS_ROW_2 = {"covers","ties","cuts","disproves","eats"};
		String[] VERBS_ROW_3 = {"crushes","cuts","ties","smashes", "decaptiates"};
		String[] VERBS_ROW_4 = {"vaporizes", "disproves", "smashes", "ties", "poisons"};
		String[] VERBS_ROW_5 = {"crushes", "eats", "decapitates", "poisons", "ties"};
		
		
		
		
		String [][] reason = new String [5][5];
		
		
		
		for(int x=0; x<5; x++){
			for(int y=0; y<5; y++){
				if(x == 0)
					reason[x][y] = VERBS_ROW_1[y];
				else if(x == 1)
					reason[x][y] = VERBS_ROW_2[y];
				else if(x == 2)
					reason[x][y] = VERBS_ROW_3[y];
				else if(x == 3)
					reason[x][y] = VERBS_ROW_4[y];
				else if(x == 4)
					reason[x][y] = VERBS_ROW_5[y];
			}
		}
		
		for(int x=0; x<5; x++){
			for(int y=0; y<5; y++){
				System.out.print(reason[x][y]);
			}
				System.out.println("");
			}
	
	
	}
}