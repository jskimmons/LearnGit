import java.io.File;
import java.io.FileNotFoundException;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;

import static java.util.Arrays.asList;

public class SymbolBalance {

    /**
     *	@param fileName of text file to check for balanced symbols
     *	@return Return an ErrorCode object with the following specifications:
     *			code = 0 if symbols are properly balanced.
     *			code = 1 if an opening symbol has no matching closing symbol. Return the
     *					 symbol as openSymbol
     *			code = 2 if a closing symbol has no matching opening symbol. Return the
     *					 symbol as closeSymbol
     *			code = 3 if two symbols mismatch. Return the opening symbol as openSymbol
     *					 and the closing symbol as closeSymbol.
     *			You should also return the line number at which you detect the error
     *			as the lineNumber variable. The first line is 1.
     */
    public static ErrorCode balanceSymbols(String fileName) throws FileNotFoundException {
        ErrorCode error = new ErrorCode();
		/* Implementation goes here */
		// One stack for the symbols, one to hold the line numbers.
		LinkedList<String> stack = new LinkedList<>();
		LinkedList<Integer> lineNum = new LinkedList<>();
        List<String> open = asList("{", "[", "(", "/*");
        List<String> close = asList("}", "]", ")", "*/");
        File file = new File(fileName);
		Scanner fileScan = new Scanner(file);
        String current;
        String currentChar;
        int lineCount=0;
        while(fileScan.hasNext()) {
            current = fileScan.nextLine();
            lineCount++;

            // Loops through each character of each line in the file
            for (int x = 0; x < current.length(); x++) {
                // Tries to create a substring for the currentChar but catches an index error
                try{
                    currentChar = current.substring(x, x+1);
                }
                catch(Exception IndexOutOfBoundsException){
                    currentChar = current.substring(x);
                }

                // handles when the symbol is a comment, opening or closing
                if(currentChar.equals("/")) {
                    try {
                        if ("/*".equals(current.substring(x, x + 2))) {
                            currentChar = "/*";
                        }
                    } catch(Exception StringIndexOutofBoundsException){}
                } else if(currentChar.equals("*")){
                    try{
                        if ("*/".equals(current.substring(x,x+2))) {
                            currentChar = "*/";
                        }
                    } catch(Exception StringIndexOutofBoundsException){}
                }

                // When the current character is ", special cases must be made...
                if(currentChar.equals("\"")){
                    if(stack.peek() == null) {
                        stack.push(currentChar);
                        lineNum.push(lineCount);
                    }
                    else if (!(stack.peek().equals("\"")) && !(stack.peek().equals("/*"))){
                        stack.push(currentChar);
                        lineNum.push(lineCount);
                    }
                    else{
                        if(lineNum.peek() != lineCount){
                            error.code = 1;
                            error.openSymbol = stack.pop();
                            error.lineNumber = lineNum.pop();
                            return error;
                        }
                        else if(!(stack.peek().equals("/*"))){
                            stack.pop();
                            lineNum.pop();
                        }
                    }
                }

                // if the character is an open character
                else if (open.contains(currentChar)) {
                    if(stack.isEmpty()) {
                        stack.push(currentChar);
                        lineNum.push(lineCount);
                    }
                    else if(!(stack.peek().equals("/*")) && !(stack.peek().equals("\""))) {
                        stack.push(currentChar);
                        lineNum.push(lineCount);
                    }
                }

                // if the character is a closing character
                else if (close.contains(currentChar)) {
                    if(stack.peek() == null){
                        error.lineNumber = lineCount;
                        error.code = 2;
                        error.closeSymbol = currentChar;
                        return error;
                    }
                    else if ((open.indexOf(stack.peek()) != close.indexOf(currentChar))) {
                        if (!(stack.peek().equals("/*")) && !(stack.peek().equals("\""))) {
                            error.lineNumber = lineCount;
                            error.code = 3;
                            error.openSymbol = stack.pop();
                            error.closeSymbol = currentChar;
                            return error;
                        }
                    } else {
                        stack.pop();
                        lineNum.pop();
                    }
                }
            }
        }

        // if something is left on the stack after everything is read, there must be something without a closing character...
        if(!stack.isEmpty()){
            error.code = 1;
            error.openSymbol = stack.pop();
            error.lineNumber = lineNum.pop();
            return error;
        }


        return error;
    }

    public static void main(String[] args) throws FileNotFoundException {
        System.out.println(balanceSymbols(args[0]));
    }

    /* ---- DON'T CODE BELOW THIS LINE ---- */
    private static class ErrorCode {
        public int code;
        public int lineNumber;
        public String openSymbol;
        public String closeSymbol;

        public ErrorCode(int code, int lineNumber, String openSymbol, String closeSymbol) {
            this.code = code;
            this.lineNumber = lineNumber;
            this.openSymbol = openSymbol;
            this.closeSymbol = closeSymbol;
        }

        public ErrorCode() {
            // returns empty object to be filled in
        }

        public String toString() {
            switch(code) {
                case 0: return "Success! Symbols are balanced.";
                case 1: return "Unbalanced! At " + lineNumber + " Symbol " +
                        openSymbol + " has no matching closing symbol.";

                case 2: return "Unbalanced! At " + lineNumber + " Symbol " +
                        closeSymbol + " has no matching opening symbol.";

                case 3: return "Unbalanced! At " + lineNumber + " Symbol " +
                        openSymbol + " matches with " + closeSymbol;

                default: return "Invalid error code!";
            }
        }
    }
}
