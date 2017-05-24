public class Lcs {

    public static int lcs(char[] a, char[] b) {

        int [][] solutionArr = new int[a.length+1][b.length+1];
        for (int i = 0; i <= a.length; i++) {
            for (int j = 0; j <= b.length; j++) {
                if (i == 0 || j == 0){ solutionArr[i][j] = 0;}
                else if (a[i-1] == b[j-1]){
                    solutionArr[i][j] = 1 + solutionArr[i-1][j-1];
                }
                else {
                    solutionArr[i][j] = Math.max(solutionArr[i-1][j], solutionArr[i][j-1]);
                }
            }
        }

        return solutionArr[a.length][b.length];
    }

    public static void main(String[] args){

        String string1 = "dynamic";
        String string2 = "programming";

        char[] a = string1.toCharArray();
        char[] b = string2.toCharArray();
        
        System.out.println(lcs(a,b)); // should return 3. We will provide more examples on Piazza.
    }
}
