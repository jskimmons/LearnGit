#include <iostream>
using namespace std;

namespace first
{
	int x=6;
	int y=5;
}

namespace second
{
	int x=10;
	int y=20;
}

namespace third
{
	int x = 30;
}

template <class T>
T sum (T a, T b) {
	T result = a + b;
	return result;
}

int	main(int argc, char const *argv[])
{
	int x;
	x = sum<int>(5,6);
	cout<<x;
	cout<<'\n';
	return 0;
}