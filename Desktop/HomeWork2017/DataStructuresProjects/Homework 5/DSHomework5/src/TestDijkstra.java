import java.io.IOException;

public class TestDijkstra {

  public static void main(String[] args) throws IOException {
      Graph g = MapReader.readGraph(args[0],args[1]);
      g.computeAllEuclideanCosts();
      Graph dijkstraResult = g.getShortestPath(args[2],args[3]);
      DisplayGraph display = new DisplayGraph(dijkstraResult);
      display.setVisible(true);
  }

}
