read MC1.json file

splitted nodes and links keys of the json into 2 csv files (nodes.csv and edges.csv)

edges:
* removed dataset and key columns
* saved the remaining dataset in a json file
* generated random coordinates for each of the unique values in source and target columns
* the new dataset has the columns (or properties in json)

        type, weight, source, sourceX, sourceY, target, targetX, targetY

nodes:
* removed dataset column
* saved the remaining dataset in a json file
