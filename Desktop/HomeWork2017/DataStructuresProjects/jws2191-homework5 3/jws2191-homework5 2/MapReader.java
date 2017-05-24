import java.io.*;
import java.util.Scanner;

public class MapReader {

  public static Graph readGraph(String vertexfile, String edgefile) throws IOException {

    Graph graph = new Graph();

    String line = "";
    BufferedReader fileReader = new BufferedReader(new FileReader("ttrvertices.txt"));

    while ((line = fileReader.readLine()) != null)
    {
      String[] data = line.split(",");
      graph.addVertex(new Vertex(data[0], Integer.parseInt(data[1]), Integer.parseInt(data[2])));
    }

    line = "";
    fileReader = new BufferedReader(new FileReader("ttredges.txt"));

    while ((line = fileReader.readLine()) != null)
    {
      String[] data = line.split(",");
      graph.addUndirectedEdge(data[0], data[1],1.0);
    }

    return graph;
  }

  public static void main(String[] args) throws IOException {
    Graph g = readGraph(args[0],args[1]);
    DisplayGraph display = new DisplayGraph(g);
    display.setVisible(true);
  }

}
