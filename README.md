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

created buttons for the controls:
* each button controls one kind of link to be showed or not (showed in grey) in the map

TODO:
* report about the select
* in the select reset the other one with the all option
* in the select the options show twice, something is broken with the

        * // Create a set of unique sources 
        const uniqueTargets = Array.from(new Set(data.map(d => d.target)));
* make the circles of the companies bigger based on the number of targets they're connected to (and a switch to switch based on the number of targets and the number of sources) (generate a new json source for that)