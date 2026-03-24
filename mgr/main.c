#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// print help message
void printHelp(char* name){
	printf("Welcome to %s\n", name);
}

// create new blog
void newBlog(char* title) {
    // use this pointer

    
    printf("%s", title);
}

int main(int argc,char* argv[]) {
	// no argument
	if (argc == 1){
		printHelp(argv[0]);
		return 0;
	}
    // consider how to save blogs
	// create new blog
    if (strcmp(argv[1], "new") == 0) {
        char title[20];
        // if user haven't enter a title
		if (argc == 2) {
            printf("Please enter a title for new blog:");
            scanf("%s", &title);
        }
        else if (argc == 3) {
            strcpy(title, argv[2]);
        }
        else {
            printf("ERROR: Too much argument give");
            return 0;
        }
        // test
        newBlog(title);
	}


}
