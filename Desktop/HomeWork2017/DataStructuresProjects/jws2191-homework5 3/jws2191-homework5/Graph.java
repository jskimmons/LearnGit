import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
public class Graph {

  // Keep a fast index to nodes in the map
  protected Map<String, Vertex> vertices;

  /**
   * Construct an empty Graph.
   */
  public Graph() {
    vertices = new HashMap<String, Vertex>();
  }

  public void addVertex(String name) {
    Vertex v = new Vertex(name);
    addVertex(v);
  }

  public void addVertex(Vertex v) {
    if (vertices.containsKey(v.name))
      throw new IllegalArgumentException(
          "Cannot create new vertex with existing name.");
    vertices.put(v.name, v);
  }

  public Collection<Vertex> getVertices() {
    return vertices.values();
  }

  public Vertex getVertex(String s) {
    return vertices.get(s);
  }

  /**
   * Add a new edge from u to v. Create new nodes if these nodes don't exist
   * yet. This method permits adding multiple edges between the same nodes.
   * 
   * @param nameU
   *          the source vertex.
   * @param nameV
   *          the target vertex.
   * @param cost
   *          the cost of this edge
   */
  public void addEdge(String nameU, String nameV, Double cost) {
    if (!vertices.containsKey(nameU))
      addVertex(nameU);
    if (!vertices.containsKey(nameV))
      addVertex(nameV);
    Vertex sourceVertex = vertices.get(nameU);
    Vertex targetVertex = vertices.get(nameV);
    Edge newEdge = new Edge(sourceVertex, targetVertex, cost);
    sourceVertex.addEdge(newEdge);
  }

  /**
   * Add a new edge from u to v. Create new nodes if these nodes don't exist
   * yet. This method permits adding multiple edges between the same nodes.
   * 
   * @param nameU
   *          unique name of the first vertex.
   * @param nameV
   *          unique name of the second vertex.
   */
  public void addEdge(String nameU, String nameV) {
    addEdge(nameU, nameV, 1.0);
  }

  /**
   * Add a bidirectional edge between u and v. Create new nodes if these nodes don't exist
   * yet. This method permits adding multiple edges between the same nodes.
   *
   * @param nameU
   *          the source vertex.
   * @param nameV
   *          the target vertex.
   * @param cost
   *          the cost of this edge
   */
  public void addUndirectedEdge(String nameU, String nameV, Double cost) {
    addEdge(nameU, nameV, cost);
    addEdge(nameV, nameU, cost);
  }


  /****************************
   * Your code follow here.   *
   ****************************/ 

  public void computeAllEuclideanCosts() {
      for(String x : vertices.keySet()) {
          for (Edge y : vertices.get(x).getEdges()) {
              y.distance = Math.sqrt(Math.pow((y.source.posX - y.target.posX), 2) + Math.pow((y.source.posY - y.target.posY), 2));
              //System.out.println(x + " " + y.distance);
          }
      }
  }

  /** Dijkstra's */
  public void doDijkstra(String s) {
      for(String x : vertices.keySet()) {
          vertices.get(x).cost = Integer.MAX_VALUE;
          vertices.get(x).visited = false;
          vertices.get(x).backpointer = null;
      }

      vertices.get(s).cost = 0;
      BinaryHeap<Vertex> q = new BinaryHeap<>(101);
      q.insert(vertices.get(s));

      while (!q.isEmpty()){
          Vertex u = q.deleteMin();
          u.visited = true;
          for(Edge v : u.getEdges()){
              if(!v.target.visited){
                  double c = u.cost + v.distance;
                  if (c < v.target.cost){
                      //System.out.println("EDGE" + v);
                      v.target.cost = c;
                      //System.out.println("NEWC" + v.target.cost);
                      v.target.backpointer = u;
                      //System.out.println("BACKPOINTER" + v.target.backpointer);
                      q.insert(v.target);
                      //System.out.println("INSERT" + v.target + v.target.cost);
                  }
              }
          }
      }
  }

  public Graph getShortestPath(String s, String t) throws IOException {
      doDijkstra(s);
      Graph g = new Graph();
      Vertex start = vertices.get(t);
      Vertex prev = start;


      String line = "";
      BufferedReader fileReader = new BufferedReader(new FileReader("ttrvertices.txt"));
      while ((line = fileReader.readLine()) != null)
      {
          String[] data = line.split(",");
          g.addVertex(new Vertex(data[0], Integer.parseInt(data[1]), Integer.parseInt(data[2])));
      }

      while(!prev.equals(vertices.get(s))){
          g.addUndirectedEdge(prev.name, prev.backpointer.name, prev.cost - prev.backpointer.cost);
          prev = prev.backpointer;
      }

      return g;
  }

  /** Prim's */
  public void doPrim(String s) {
      for(String x : vertices.keySet()) {
          vertices.get(x).cost = Integer.MAX_VALUE;
          vertices.get(x).visited = false;
          vertices.get(x).backpointer = null;
      }

      vertices.get(s).cost = 0;
      BinaryHeap<Vertex> q = new BinaryHeap<>(101);
      q.insert(vertices.get(s));

      while (!q.isEmpty()){
          Vertex u = q.deleteMin();
          u.visited = true;
          for(Edge v : u.getEdges()){
              if(!v.target.visited){;
                  if (v.distance < v.target.cost){
                      //System.out.println("EDGE" + v);
                      v.target.cost = v.distance;
                      //System.out.println("NEWC" + v.target.cost);
                      v.target.backpointer = u;
                      //System.out.println("BACKPOINTER" + v.target.backpointer);
                      q.insert(v.target);
                      //System.out.println("INSERT" + v.target + v.target.cost);
                  }
              }
          }
      }

  }

  public Graph getMinimumSpanningTree(String s) throws IOException {
      doPrim(s);
      Graph g = new Graph();

      String line = "";
      BufferedReader fileReader = new BufferedReader(new FileReader("ttrvertices.txt"));
      while ((line = fileReader.readLine()) != null)
      {
          String[] data = line.split(",");
          g.addVertex(new Vertex(data[0], Integer.parseInt(data[1]), Integer.parseInt(data[2])));
      }

      Vertex prev = null;
      for(String x : vertices.keySet()){
          prev = vertices.get(x);
          while(!prev.equals(vertices.get(s))){
              g.addUndirectedEdge(prev.name, prev.backpointer.name, prev.cost - prev.backpointer.cost);
              prev = prev.backpointer;
          }
      }

      return g;
  }

  /*************************/

  public void printAdjacencyList() {
    for (String u : vertices.keySet()) {
      StringBuilder sb = new StringBuilder();
      sb.append(u);
      sb.append(" -> [ ");
      for (Edge e : vertices.get(u).getEdges()) {
        sb.append(e.target.name);
        sb.append("(");
        sb.append(e.distance);
        sb.append(") ");
      }
      sb.append("]");
      System.out.println(sb.toString());
    }
  }

  public static void main(String[] args) throws IOException {
    Graph g = new Graph();
    g.addVertex(new Vertex("v0", 0, 0));
    g.addVertex(new Vertex("v1", 0, 1));
    g.addVertex(new Vertex("v2", 1, 0));
    g.addVertex(new Vertex("v3", 1, 1));

    g.addUndirectedEdge("v0", "v1",0.0);
    g.addUndirectedEdge("v1", "v2",0.0);
    g.addUndirectedEdge("v2", "v3",0.0);
    g.addUndirectedEdge("v3", "v0",0.0);
    g.addUndirectedEdge("v0", "v2",0.0);
    g.addUndirectedEdge("v1", "v3",0.0);

    g.printAdjacencyList();
    g.computeAllEuclideanCosts();
    Graph dijkstraResult = g.getShortestPath("v0", "v1");
    DisplayGraph display = new DisplayGraph(dijkstraResult);
    DisplayGraph display1 = new DisplayGraph(g);
    display.setVisible(true);
    display1.setVisible(true);
  }

}
