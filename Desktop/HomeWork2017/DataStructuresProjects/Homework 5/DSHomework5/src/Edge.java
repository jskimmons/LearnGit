public class Edge implements Comparable<Edge> {
  public Vertex source;
  public Vertex target;
  public Double distance;

  public Edge(Vertex source, Vertex target, Double theDistance) {
      this.source = source;
      this.target = target;
      this.distance = theDistance;
  }

  public Edge(Vertex source, Vertex target) {
    this(source, target, 1.0);
  }

  public int compareTo(Edge other) {
    return distance.compareTo(other.distance);
  }

  public String toString() {
      return this.source.name + " " + this.target.name;
  }

}
