public class Process implements Comparable<Process>{

    public int priority;
    public String name;

    public Process(String name, int priority){
        this.name = name;
        this.priority = priority;
    }

    public int compareTo(Process other) {
        return this.priority - other.priority;
    }

    public boolean equals(Object other) {
        if (other instanceof Process) {
            Process otherProcess = (Process) other;
            return this.name.equals(otherProcess.name);
        } else {
            return false;
        }
    }

    public int hashCode() {
        return this.name.hashCode();
    }

    public String toString() {
        return "<"+this.name+","+this.priority+">";
    }

}
