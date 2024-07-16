# Visual-analytics

# TODO:
* graph:
  * sometimes there are mutliple links between the same 2 source and target, find a (better) way to plot both of the types of connection, at least in the markers
  * check behaviour for node click when there are more than 1 source to add, and for when the buttons are pressed and maybe for when the values in the select change;
  when a node is clicked the nodes that used to be also sources become only targets (for the original node and the new node, also the node that was clicked stays green    
  * load the nodes dataset and put a color countour on the node based on the type of node (data source: nodes.json (or last version of it))
  * when hovering a node that has the country value in the dataset add that to the tooltip
  
  * for only to investigate companies mode 
    * add to the sources an option to plot the 4 and move the 4 to the top of the selects
    * when either one of the four or the option with the 4 is selected add to the controls a slider to plot the connections of those nodes
* dataset:
  * order the sources from the one with most targets to the one with less

## commands to run the project:
* npm run build
* npm start

## record of what i have done so far:

* ### datasets
  ---

  read MC1.json file

  splitted nodes and links keys of the json into 2 csv files (nodes.csv and edges.csv)

  #### edges:
  ---
  * removed "dataset" and "key" columns
  * saved the remaining dataset in a json file
  * (discarded) generated random coordinates for each of the unique values in source and target columns
    * found that the size of the chrome window, on my laptop, with the commands column, are width="1399" height="888"
    * the coordinates of the values in the 2 columns are going to be between 10 and 1389 for the x and between 10 and 878 for the y
    * the random seed is 42
  * the new dataset has the columns (or properties in json)

        type, weight, source, sourceX, sourceY, target, targetX, targetY
  * the dataset has now the column

        type, weight, source, target
  * (discarded) after this i tried to remove the dead ends of the dataset
    * i defined a dead end as a node which is only target of other sources
    * after putting more toughts into it i decided to not remove those so called dead ends because sometimes nodes are only target but they are targets of other companies and that might be interesting for too see which companies, for example, own a single company togheter
  * after that i continued with the analysis of the weights column
    * weights goes from 0 to 1 so i decided to plot the weights in intervals of 0.05 to check how many fell into each bin
    * i already did the plotting of the nodes and relative links, where the link line tickness depended on the weight, so i kinda knew that most of the weights fell around 1 but this plot shows even more why the weight column is kinda useless 
    ![weights plotted](readmeImages/weights%20plotted.png)
    * 10981 records are > 0.8 and 88 records are <= 0.8
    * after that i tried to create the plot only the 88 nodes with low weight links and that did not yelded any interesting results
  ---
  #### nodes:
  ---
  * removed dataset column
  * saved the remaining dataset in a json file
  * at first i removed the records where the type column was empty
  * after that i checked if there were duplicates in the dataset using the code
        
        df.duplicated().sum()
    but it yelded 0
  
    I then checked with the value_counts for each of the columns (
        
        for col in df.columns:
            print(f"{col}: {df[col].value_counts()}\n")

    )
    and found that some of the ids were repeated ![repeated ids](./readmeImages/repeated%20ids.png)
    
    at first glance vessel seems to be the most common type in the type duplicates dataset

    therefore, in the beginning i tought to remove the instances where type is 'vessel' because it seemed to me as a wrong record of the data.
    ![node types frequency plot](./readmeImages/node%20type%20frequency%20plot.png)

    after plotting the quantities of each type, one can observe that the vessel class is not one of the most commons

    therefore i decided to remove the instances that are the least common as a type from the dataset

    so for example in the cases of :

    966	organization	None	18

    226	vessel	None	18

    since organization is present 987 times into the dataset and vessel is present 115 times the instance of type vessel will be stored in the new dataset

    and 

    1296	movement	None	38

    1170	organization	None	38

    since organization is present 987 times into the dataset and movement is present 21 times the instance of type movement will be stored in the new dataset

  ---
  #### merged dataset
  ---
  after the reported modifications on the edges and nodes dataset i decided to merge the 2 to get a dataset with the following columns
        
      'typeOfLink', 'weight', 
      'source', 'sourceType', 'sourceCountry',
      'target', 'targetType', 'targetCountry'

  as said before some of the types and sources are missing, in fact there are

  * 2594 missing sourceType 
  * 2769 missing targetType 
  * 8066 missing sourceCountry
  * 7522 missing targetCountry 

  i decided to replace the missing values with the string 'Unknown' because i still wanted to keep the present informations in the plot 

  ---
* ### UI
  ---
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
  * each link as a arrow marker (of the same color of the link) to signal the direction of the link
 
