public class Rectangle implements Comparable<Rectangle> {

    private int width;
    private int length;
    private int area;

    public Rectangle(int l, int w) {
        this.length = l;
        this.width = w;
        this.area = length * width;
    }

    public int getWidth() {
        return width;
    }

    public int getLength() {
        return length;
    }

    public int getArea() {
        return area;
    }

    public String toString() {
        String t = "Length: " + this.length + ", Width: " + this.width;
        return t;

    }

    /*
     * returns 1 if the passed rectangle is smaller, -1 if it is larger, and 0
     * if they are equal
     */
    @Override
    public int compareTo(Rectangle rect) {
        if (this.area > rect.area)
            return 1;
        if (this.area < rect.area)
            return -1;
        else
            return 0;
    }
}
