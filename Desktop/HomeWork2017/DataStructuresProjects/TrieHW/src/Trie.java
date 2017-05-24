import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Trie {

    private TrieNode root;
    public static final char NULL = '0';

    public Trie() {
        root = new TrieNode(NULL, 0);
    }

    // implement your methods here
    // feel free (and you probably should) add helper private methods

    // problem 4a
    public void addWord(String word) {
        for (int x=0; x<word.length(); x++){
            if(word.charAt(x) < 97){
                throw new IllegalArgumentException("Input must be lowercase");
            }
        }
        recursiveAdd(word, root, 0);
    }

    private void recursiveAdd(String word, TrieNode root, int wordCount){
        if (word.length() == 0) {
            wordCount++;
            root.endOfWordCount += wordCount;
            return;
        }
        char firstLetter = word.charAt(0);
        boolean isContained = false;
        for (TrieNode x : root.children) {
            if (x != null && x.letter == firstLetter) {
                isContained = true;
            }
        }
        if (!isContained){
            root.children[firstLetter-97] = new TrieNode(firstLetter, wordCount);
            word = word.substring(1);
            recursiveAdd(word, root.children[firstLetter-97], wordCount);
        }
        else{
            word = word.substring(1);
            recursiveAdd(word, root.children[firstLetter-97], wordCount);
        }

    }

    // problem 4b
    public int countWord(String word) {
        return recursiveCount(word, root);
    }

    private int recursiveCount(String word, TrieNode root) {
        if (word.length() == 0)
            return root.endOfWordCount;
        char firstLetter = word.charAt(0);
        boolean isContained = false;
        for (TrieNode x : root.children) {
            if (x != null && x.letter == firstLetter) {
                isContained = true;
            }
        }
        if(isContained)
            return recursiveCount(word.substring(1), root.children[firstLetter-97]);
        else
            return 0;
    }

    // problem 4c
    public List<String> getStrings() {
        return getStringsRecursive(root, new String(), new ArrayList<>());
    }

    private List<String> getStringsRecursive(TrieNode node, String prefix, ArrayList<String> list){
        if (node == null) {
            return list;
        }
        else if (node.endOfWordCount!=0) {
            list.add((prefix + node.letter).substring(1));
        }
        prefix += node.letter;

        for (TrieNode child : node.children) {
            getStringsRecursive(child, prefix, list);
        }
        return list;
    }

    // problem 4d
    public List<String> getStartsWith(String prefix) {
        TrieNode newRoot = getPrefixNode(prefix, root);
        return getStartsWithRecursive(newRoot, new String(), new ArrayList<String>(), prefix);
    }

    private List<String> getStartsWithRecursive(TrieNode node, String prefix, ArrayList<String> list, String tmp){
        if (node == null) {
            return list;
        }
        else if (node.endOfWordCount!=0) {
            list.add(tmp + (prefix + node.letter).substring(1));
        }
        prefix += node.letter;

        for (TrieNode child : node.children) {
            getStartsWithRecursive(child, prefix, list, tmp);
        }
        return list;
    }

    private TrieNode getPrefixNode(String prefix, TrieNode current) {
        if (prefix.length() == 0)
            return current;
        if (current.children[prefix.charAt(0) - 97] != null) {
            current = current.children[prefix.charAt(0) - 97];
            return getPrefixNode(prefix.substring(1), current);
        }
        return current;
    }
    //problem 4e
    public List<WordCount> occursMoreThan(int frequency) {
        List<WordCount> result = occursMoreThanRecursive(frequency, root, "", new ArrayList<WordCount>());
        Collections.sort(result, Collections.reverseOrder());
        return result;
    }

    private List<WordCount> occursMoreThanRecursive(int frequency, TrieNode node, String tmp, ArrayList<WordCount> list){
        if (node == null) {
            return list;
        }
        else if (node.endOfWordCount >= frequency) {

            list.add(new WordCount((tmp + node.letter).substring(1), node.endOfWordCount));
        }
        tmp += node.letter;

        for (TrieNode child : node.children) {
            occursMoreThanRecursive(frequency, child, tmp, list);
        }
        return list;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        buildString(root, sb, 0);
        return sb.toString().trim();
    }

    private void buildString(TrieNode node, StringBuilder sb, int layer) {
        for (int i = 0; i < layer; i++) {  // print some indentation
            sb.append(" ");
        }
        sb.append(node);    // print the node itself
        sb.append("\n");
        for (TrieNode child : node.children) {  // recursively print each subtree
            if (child != null) {
                buildString(child, sb, layer + 1);
            }
        }
    }

    private class TrieNode {
        public char letter;
        public int endOfWordCount;
        public TrieNode[] children;

        public TrieNode(char letter, int endOfWordCount) {
            this.letter = letter;
            this.endOfWordCount = endOfWordCount;
            children = new TrieNode[26]; // number of letters in English alphabet
        }

        public String toString() {
            return (endOfWordCount != 0) ? Character.toString(Character.toUpperCase(letter)) : Character.toString(letter);
        }
    }

    public static void main(String[] args) {
        Trie trie = new Trie();
        trie.addWord("hello");
        trie.addWord("help");
        System.out.println("hello occurs " + trie.countWord("hello") + " times");
        trie.addWord("hello");
        trie.addWord("hello");
        trie.addWord("hellicopter");
        trie.addWord("hella");
        trie.addWord("foo");
        trie.addWord("fooo");
        System.out.println(trie);
        System.out.println(trie.getStartsWith("hell"));
        trie.addWord("hella");
        trie.addWord("foo");
        System.out.println(trie.occursMoreThan(2));
    }
}