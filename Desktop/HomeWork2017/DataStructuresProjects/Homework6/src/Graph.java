import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class Graph {

  // Keep a fast index to nodes in the map
  private Map<Integer, Vertex> vertices;

  /**
   * Construct an empty Graph with a map. The map's key is the name of a vertex
   * and the map's value is the vertex object.
   */
  public Graph() {
      vertices = new HashMap<>();
  }

  /**
   * Adds a vertex to the graph. Throws IllegalArgumentException if two vertices
   * with the same name are added.
   * 
   * @param v
   *          (Vertex) vertex to be added to the graph
   */
  public void addVertex(Vertex v) {
    if (vertices.containsKey(v.name))
      throw new IllegalArgumentException("Cannot create new vertex with existing name.");
    vertices.put(v.name, v);
  }

  /**
   * Gets a collection of all the vertices in the graph
   * 
   * @return (Collection<Vertex>) collection of all the vertices in the graph
   */
  public Collection<Vertex> getVertices() {
    return vertices.values();
  }

  /**
   * Gets the vertex object with the given name
   * 
   * @param name
   *          (String) name of the vertex object requested
   * @return (Vertex) vertex object associated with the name
   */
  public Vertex getVertex(int name) {
    return vertices.get(name);
  }

  /**
   * Adds a directed edge from vertex u to vertex v
   * 
   * @param nameU
   *          (String) name of vertex u
   * @param nameV
   *          (String) name of vertex v
   * @param cost
   *          (double) cost of the edge between vertex u and v
   */
  public void addEdge(int nameU, int nameV, Double cost) {
    if (!vertices.containsKey(nameU))
      throw new IllegalArgumentException(nameU + " does not exist. Cannot create edge.");
    if (!vertices.containsKey(nameV))
      throw new IllegalArgumentException(nameV + " does not exist. Cannot create edge.");
    Vertex sourceVertex = vertices.get(nameU);
    Vertex targetVertex = vertices.get(nameV);
    Edge newEdge = new Edge(sourceVertex, targetVertex, cost);
    sourceVertex.addEdge(newEdge);
  }

  /**
   * Adds an undirected edge between vertex u and vertex v by adding a directed
   * edge from u to v, then a directed edge from v to u
   * 
   * @param name
   *          (String) name of vertex u
   * @param name2
   *          (String) name of vertex v
   * @param cost
   *          (double) cost of the edge between vertex u and v
   */
  public void addUndirectedEdge(int name, int name2, double cost) {
    addEdge(name, name2, cost);
    addEdge(name2, name, cost);
  }


  /**
   * Computes the euclidean distance between two points as described by their
   * coordinates
   * 
   * @param ux
   *          (double) x coordinate of point u
   * @param uy
   *          (double) y coordinate of point u
   * @param vx
   *          (double) x coordinate of point v
   * @param vy
   *          (double) y coordinate of point v
   * @return (double) distance between the two points
   */
  public double computeEuclideanDistance(double ux, double uy, double vx, double vy) {
    return Math.sqrt(Math.pow(ux - vx, 2) + Math.pow(uy - vy, 2));
  }

  /**
   * Computes euclidean distance between two vertices as described by their
   * coordinates
   * 
   * @param u
   *          (Vertex) vertex u
   * @param v
   *          (Vertex) vertex v
   * @return (double) distance between two vertices
   */
  public double computeEuclideanDistance(Vertex u, Vertex v) {
    return computeEuclideanDistance(u.x, u.y, v.x, v.y);
  }

  /**
   * Calculates the euclidean distance for all edges in the map using the
   * computeEuclideanCost method.
   */
  public void computeAllEuclideanDistances() {
    for (Vertex u : getVertices()) {
        for (Edge uv : u.adjacentEdges) {
            Vertex v = uv.target;
            uv.distance = computeEuclideanDistance(u.x, u.y, v.x, v.y);
        }
    }
  }

  // STUDENT CODE STARTS HERE

  public void generateRandomVertices(int n) {
    vertices = new HashMap<>(); // reset the vertex hashmap
    Random rand = new Random();
    for (int i = 0; i < n; i++) {
        addVertex(new Vertex(i, rand.nextInt(101), rand.nextInt(101)));
        for (Vertex x : vertices.values()){
            if (x.name != i)
                addUndirectedEdge(x.name, i, 1.0);
        }
    }
    computeAllEuclideanDistances(); // compute distances
  }

  public List<Edge> nearestNeighborTsp() {
      LinkedList<Edge> edgeList = new LinkedList<>();
      LinkedList<Vertex> unvisited = new LinkedList<>();
      for (Vertex v : getVertices()){
          v.known = false;
          unvisited.add(v);
      }
      Vertex start = getVertex(0);
      Edge currentEdge = null;
      Vertex currentVertex = start;
      double minDistance = Double.MAX_VALUE;

      while(!unvisited.isEmpty()){
          for (Edge e : currentVertex.adjacentEdges){
              if (e.distance < minDistance && !e.target.known) {
                  currentEdge = e;
                  minDistance = currentEdge.distance;
              }
          }
          unvisited.remove(currentVertex);
          currentVertex.known = true;
          currentVertex = currentEdge.target;
          minDistance = Double.MAX_VALUE;
          edgeList.add(currentEdge);
      }
      Edge last = null;
      for (Edge e : currentVertex.adjacentEdges){
          if (e.target.equals(start)){
              last = e;
          }
      }
      edgeList.add(last);
      return edgeList;

  }

  public LinkedList<LinkedList<Integer>> findPermutations(int n, LinkedList<LinkedList<Integer>> permutations){
      permutations.clear();
      LinkedList<Integer> start = new LinkedList<>();
      for (int i =  1; i < n; i++) {
          start.add(i);
      }
      return permutate(new LinkedList<Integer>(), start, permutations);
  }

  private LinkedList<LinkedList<Integer>> permutate(LinkedList<Integer> perm, LinkedList<Integer> input, LinkedList<LinkedList<Integer>> permutations) {
      if (input.isEmpty()){
          perm.add(0);
          permutations.add(perm);
      }
      else {
          for (int i = 0; i < input.size(); i++) {
              LinkedList<Integer> tmpPerm = new LinkedList<>();
              tmpPerm.addAll(perm);
              LinkedList<Integer> tmpInput = new LinkedList<>();
              tmpInput.addAll(input);
              tmpPerm.addFirst(input.get(i));
              tmpInput.remove(i);
              permutate(tmpPerm, tmpInput, permutations);
          }
      }
      return permutations;
  }


  public List<Edge> bruteForceTsp() {
      LinkedList<LinkedList<Integer>> permutations = findPermutations(vertices.size(), new LinkedList<>());
      // System.out.println(permutations.size());
      LinkedList<Edge> edgeList = new LinkedList<>();
      Vertex start = getVertex(0);
      Edge current = null;
      // find lowest cost path
      Double lowestCostPath = Double.MAX_VALUE;
      LinkedList<Edge> tmpEdgeList = new LinkedList<>();

      for (LinkedList<Integer> list : permutations){
          Double currentCost = 0.0;
          for (Integer x : list) {
              for (Edge e : start.adjacentEdges) {
                  if (e.target.name == x){
                      currentCost += e.distance;
                      current = e;
                      tmpEdgeList.add(e);
                  }
              }
              start = current.target;
          }
          if (currentCost < lowestCostPath){
              edgeList.clear();
              edgeList.addAll(tmpEdgeList);
              lowestCostPath = currentCost;
          }
          tmpEdgeList.clear();
      }

      return edgeList; // replace this line
  }

  // STUDENT CODE ENDS HERE

  /**
   * Prints out the adjacency list of the graph for debugging
   */
  public void printAdjacencyList() {
    for (int u : vertices.keySet()) {
      StringBuilder sb = new StringBuilder();
      sb.append(u);
      sb.append(" -> [ ");
      for (Edge e : vertices.get(u).adjacentEdges) {
        sb.append(e.target.name);
        sb.append("(");
        sb.append(e.distance);
        sb.append(") ");
      }
      sb.append("]");
      System.out.println(sb.toString());
    }
  }

    public static void main(String[] args) {
//        Graph g = new Graph();
//        g.findPermutations(5);
//        for (LinkedList<Integer> x : permutations){
//            for (Integer y : x){
//                System.out.print(y);
//            }
//            System.out.println();
//        }
//        System.out.println(permutations.size());
    }
}
