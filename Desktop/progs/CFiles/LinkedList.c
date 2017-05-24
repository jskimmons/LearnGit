#include <stdlib.h>
#include <stdio.h>

struct node {
	int				data;
	struct node*	next;
};

struct node* build() {

	struct node *head = NULL;
	
	return head;
}

void push(struct node** headRef, int data){
	struct node* newNode = malloc(sizeof(struct node));

	newNode -> data = data;
	newNode -> next = *headRef;

	*headRef = newNode;
}

void display(struct node* head) {

	struct node* current = head;
	
	while(current != NULL) {
		int x = current -> data;
		printf("%d -> ", x);
		current = current -> next;
	}
	printf("\n");
}

int length(struct node* head) {

	struct node* current = head;
	int count = 0;

	while(current != NULL) {
		count++;
		current = current -> next;
	}

	return count;
}

int main(int argc, char const *argv[]) {
	
	struct node* head = build();
	push(&head, 1);
	push(&head, 2);
	display(head);
	pop(head);
	pop(head);
	display(head);
	//printf("Length: %d\n", length(head));
	//sort(head);
	//display(head);

	return 0;
}
