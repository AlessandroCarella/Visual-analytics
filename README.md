# Visual-analytics

## commands to remember:
* npm run build
* npm start

## record of what i have done so far:

read MC1.json file

splitted nodes and links keys of the json into 2 csv files (nodes.csv and edges.csv)

edges:
* removed dataset and key columns
* saved the remaining dataset in a json file
* generated random coordinates for each of the unique values in source and target columns
        * found that the size of the chrome window, on my laptop, are width="1899" height="888"
        * the coordinates of the values in the 2 columns are going to be between 10 and 1889 for the x and between 10 and 878 for the y
        * the random seed is 42
* the new dataset has the columns (or properties in json)

        type, weight, source, sourceX, sourceY, target, targetX, targetY

nodes:
* removed dataset column
* saved the remaining dataset in a json file
