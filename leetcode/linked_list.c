#include <stdio.h>
#include <stdlib.h>

struct node{
    int data;
    struct node *next;
};

typedef struct node Node;

int main(int argc, char *argv[]){
    Node a,b,c;
    Node *ptr = &a;

    a.data = 12;
    a.next = &b;
    b.data = 30;
    b.next = &c;
    c.data = 64;
    c.next = NULL;
    printf("***********\n\n");
    while(ptr != NULL){
        printf("address=%p, ",ptr);
        printf("data=%d, ",ptr->data);
        printf("next=%p\n",ptr->next);
        ptr=ptr->next;
    }
    printf("\n***********\n\n");

    //system("pause");
    return 0;
}