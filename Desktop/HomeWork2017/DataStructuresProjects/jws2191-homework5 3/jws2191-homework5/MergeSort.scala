object MergeSort {

    def merge(list1 : List[Int], list2 : List[Int]) : List[Int] = {
    	// chooses smaller of each head and recursively adds to the list
        if(list1.length == 0){
            list2;
        }
        else if(list2.length == 0){                     
            list1;
        }
        else if(list1.head < list2.head){
            list1.head :: merge(list1.tail, list2);
        }
        else {
            list2.head :: merge(list2.tail, list1);
        }
    }

    def sort(list : List[Int]) : List[Int] = {
    	// recursively split lists into smaller peices until they have 1 element
    	// call merge on each set of adjacent lists recursively until there is 1 left 
    	if(list.length <= 2){
            merge(List(list.head), list.tail)
        }
        else{
            val h = list.length/2;
            merge(sort(list.slice(0,h)), sort(list.slice(h, list.length)));
        }
        
    }

def main(args : Array[String]) {
        println(sort(List(9,5,7,3,1,4,6,2,8,0)));
        println(sort(List(10)));
        println(sort(List(11,2)));
        println(sort(List(9,5,7,3,1)));
    } 
}







