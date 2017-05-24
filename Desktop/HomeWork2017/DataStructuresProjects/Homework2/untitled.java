public List union(List l1, List l2){
	notContained = True;
	List union = new List();
	// Adds all of l1 to the new list
	for (int x=0;x<l1.size();x++) {
		union.add(l1.get(x));
	}
	// only adds from l2 to the union list if it is not already contained
	for (int x=0;x<l2.size();x++) {
		// compares current value to every value in union, to see if it is contained
		// does this for every value in l2
		for (int y=0;y<union.size;y++) {
			if (l2.get(x).equals(union.get(y))){
				notContained = false;
			}
		}
		// adds it only if it is not in union alreadt
		if(notContained){
			union.add(l2.get(x));	
		}
		notContained = True;
	}
	return union;
}