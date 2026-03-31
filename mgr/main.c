#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>

// print help message
void printHelp(char* name){
	printf("Welcome to %s\n", name);
}

// create new blog
void newBlog(char* title) {
    char addr[40] = "blogs/"; 

    // check if the file is already exsit
    if (access(strcat(strcat(addr, title),".md"), 0) == -1) {
        printf("ERROR: Blog already exsits\n");
    }
    // create a new .md file
    // with a default template
    
    // printf("%s", title);
    return;
}

int main(int argc,char* argv[]) {
	if (argc == 1){
        // no arguments situation
        // print help message
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
            scanf("%s", title);
        }
        else if (argc == 3) {
            strcpy(title, argv[2]);
        }
        else {
            // wrong argument
            printf("ERROR: Too much argument given\n");
            return 0;
        }
        newBlog(title);
	}


}
