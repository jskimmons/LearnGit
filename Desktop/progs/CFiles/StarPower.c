#include <stdlib.h>
#include <stdio.h>

int main(int argc, char const *argv[]) {
	for (int j = 0; j < 10; ++j)
	{
		for (int i = 0; i < j; ++i)
		{
			printf("%s","*");
		}
		printf("\n");
	}
}