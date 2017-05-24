public class WordCount implements Comparable<WordCount> {
    public String word;
    public int frequency;

    public WordCount(String word, int frequency) {
        this.word = word;
        this.frequency = frequency;
    }

    public String toString() {
        return this.word + " " + this.frequency;
    }
    public int compareTo(WordCount o) {
        return Integer.compare(this.frequency, o.frequency);
    }
}