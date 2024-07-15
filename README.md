# Visual-analytics

## commands to run the project:
* npm run build
* npm start

## record of what i have done so far:

read MC1.json file

splitted nodes and links keys of the json into 2 csv files (nodes.csv and edges.csv)

edges:
* removed dataset and key columns
* saved the remaining dataset in a json file
* generated random coordinates for each of the unique values in source and target columns
        * found that the size of the chrome window, on my laptop, with the commands column, are width="1399" height="888"
        * the coordinates of the values in the 2 columns are going to be between 10 and 1389 for the x and between 10 and 878 for the y
        * the random seed is 42
* the new dataset has the columns (or properties in json)

        type, weight, source, sourceX, sourceY, target, targetX, targetY

nodes:
* removed dataset column
* saved the remaining dataset in a json file

splitted the screen into:
* left column for controls
* right side for the map

created controls:
* each button controls one kind of link to be showed or not in the map
* one select for the sources and one for the targets in the data; once one of the options is selected all the other data is removed from the map\\
and when an option of the select is choosen the other select resets to the option All (since it doesn't make sense to choose 1 source and 1 target only (in the case where there is only 1:1 it will be showed anyway)) 

features:
* the links have one color each so that they're identifiable
* the nodes have a size related to the amount of targets that they have (the target nodes are just of r=1)
* through the buttons you can select which kind of link to be shown
* through the select you can choose which nodes should be shown

TODO:
* graph:
  * sometimes there are mutliple links between the same 2 source and target, find a (better) way to plot both of the types of connection
  * check behaviour for node click when there are more than 1 source to add, and for when the buttons are pressed and maybe for when the values in the select change
* dataset:
  * clean the dataset so that it has only relevant information and the graph is not too crowded
  * order the sources from the one with most targets to the one with less
  * clustering for the nodes, both with algorithms and with checking number of common connections
after that find the companies which own the biggest companies and see how they are connected to each other;
like if the bigger companies have the same owner
