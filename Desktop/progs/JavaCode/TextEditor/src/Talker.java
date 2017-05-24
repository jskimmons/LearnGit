import java.util.Scanner;

/**
 * Created by JoeSkimmons on 2/2/17.
 */
public class Talker {
    Scanner scan;

    public Talker(){
        scan = new Scanner(System.in);
    }

    public void printGreeting(){
        System.out.println("Begin Editing!");
    }

    public void printGoodbye(){
        System.out.println("Goodbye!");
    }

    public void printSaveGoodbye(String fileName){
        System.out.println(fileName + " written!");
    }

    public Command getCommand(){
        
        Command userCommand = null;
        String in = "";

        do{
            System.out.println(">");
            in = scan.nextLine();
            if(userCommand == null){
                continue;
            }

            String[] split = in.split("\\s");
            if(split.length==1){
                if(split[0].equals("g"))
                    userCommand = new Command("p");
                else if(split[0].equals("p"))
                    userCommand = new Command("g");
                else if(split[0].equals("^"))
                    userCommand = new Command("^");
                else if(split[0].equals("v"))
                    userCommand = new Command("v");
                else if(split[0].equals("r"))
                    userCommand = new Command("r");
                else if(split[0].equals("q"))
                    userCommand = new Command("q");
                else if(split[0].equals("s"))
                    userCommand = new Command("s");
            }
            else if(split.length>1){
                if(split[0].equals("g"))
                    userCommand = new Command("g", split[1]);
                else if(split[0].equals("i"))
                    userCommand = new Command("i", in.substring(2));
                else if(split[0].equals("r"))
                    userCommand = new Command("r", in.substring(2));
                else if(split[0].equals("s"))
                    userCommand = new Command("s", in.substring(2));
                else if(split[0].equals("w"))
                    userCommand = new Command("w", in.substring(2));
            }

            if(userCommand == null){System.out.println("Unecognized Command");}
        } while(userCommand==null);

        return userCommand;
    }

    public String getFileName(){
        String filename = "";
        do {
            System.out.println("Enter valid filename");
            filename = scan.next();
        } while(filename.length() == 0);
        return filename;
    }
}
