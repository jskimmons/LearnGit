#include <stdlib.h>
#include <stdio.h>

typedef struct node {

	int				data;
	struct node*	next;

} nodet;

struct node* init(){
	nodet * head = NULL;
	head = malloc(sizeof(nodet));
	if (head == NULL) {
		return NULL;
	}
	head -> data = 0;
	head -> next = NULL;
	return head;
};

void append(nodet* head, int val){
	nodet * current = head;
	while(current -> next != NULL){
		current = current -> next;
	}
	current -> next = malloc(sizeof(nodet));
	current -> next -> data = val;
	current -> next -> next = NULL;
}

void push(nodet* head, int val){
	nodet * new_node;
    new_node = malloc(sizeof(nodet));

    new_node->data = val;
    new_node->next = head->next;
    head->next = new_node;
}

void pop(nodet* head){
	free(head->next);
	head->next = head->next->next;
}

void removeNode(nodet* head, int delval){
	nodet* current = head;
	while(current -> next -> data != delval){
		current = current -> next;
	}
	free(current->next);
	current -> next = current -> next -> next;

}

void recall(nodet* head){
	nodet * current = head -> next;
	while(current!= NULL){
		printf("%d->", current->data);
		current = current -> next;
	}
	printf("NULL\n");
}

int main(int argc, char const *argv[])
{
	nodet* head = init();
	push(head, 1);
	push(head, 2);
	recall(head);
	pop(head);
	recall(head);
	push(head, 6);
	removeNode(head, 6);
	recall(head);
	return 0;
}
	