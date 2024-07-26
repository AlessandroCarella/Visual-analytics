# Visual-analytics

# TODO:
  * tutto
    * ~~Inverti bordi e riempimenti~~

    * ~~Nodi unknown con il colore grigio~~

    * Implementa il refresh dinamico per forza, controlla metodo join di d3.js https://d3js.org/d3-force/simulation#simulation_alphaTarget https://d3js.org/d3-force/simulation#simulation_restart 

    * Cambia forze in base al numero di nodi  diminuire forza di repulsione e edge

    * Whats the end goal of the minichallange 1, show clusters in the entities to investigate with the select setted to All and 
      * I cluster sono importanti

    * Proposal of showing svg image related to the type of node instead of the circles 
      * Si

    * Right click on the node to expand only as source or as target or as both (already in the left click anyway)
      * si

    * How should I implement the ambiguous multiple links between 2 entities, show what you have done, propose tooltip solution (show in/out nodes in the tooltip (bad for the ui, too crowded), hover on the link (hover the link to see all the links between a source and a target), other proposed by the teacher
      * Linea curva al posto della linea retta  Utilizzare path al posto di line per create la linea  trova punto medio e poi trova la curva utilizzando quel punto
      * Tooltip no perché può essere importante vedere quanti archi ci sono fra i 2 nodi
      * Arco solo quando ci sono più di un collegamento

    * ~~Can I implement the what’s going on tab or is it cheating~~
      * ~~Si ma solo legenda,~~ prova come ultima cosa a fare la speigazione contestuale

    * Keep the “fake” link between the entities to investigate or not
      * Forza di linking in base al tipo di collegamento e metterla più bassa per i link “to investigate”

    * ~~Size of the window has to fit the 16:9 1920x1080p? What about full screen?~~
      * ~~Scrolling solo sulla Colonna sinistra al posto della pagina~~

    * If the palette I’m able to extract from the image is not enough where should I get colors from
      * https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3

  * Dataset
    * Do I merge the nodes that have weird names? Like there is a node that has the id 0 and then there are multiple nodes that are named: 0 and some following gibberish
      * Lascia separati


  * Report:
    *Which are the chapters to write (cant access didawiki)
    https://web.archive.org/web/20240529095145/http://didawiki.cli.di.unipi.it/doku.php/magistraleinformaticaeconomia/va/start

    * Whats state of the art in this case (remember reading about it)
      * Nulla o cose simili che comunque sono li a grandi linee

    * Discussion about implementation that I tried but didn’t keep because they didn’t fit?
      * Perchè no

    * Do I show all I did in the data analysis part? Is what I did ok (quick runthrough)?


## To run the project:
* install node (developed in node 20.11.1)
* in the folder of the project run
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
  * the nodes have a size related to the amount of targets and sources they have (i sum them, find the sqrt of the number and multiply it by 3)
  * through the buttons you can select which kind of link to be shown
  * through the select you can choose either a source or a target
    * the selects also have an option to show the entities that the challange tells you to investigate about (one of them is only target so you have to use both select to see all of those nodes)
      * when this option is selected a new type of link between the entities to investigate pops up so that they are distinguscable
  * since each node has his type the border of each node has its own color based on the type of node
  * when you hover a node the ui will pop up a tooltip with the id (name), type, country of the node and how many targets and sources it has
  * each link as a arrow marker (of the same color of the link) to signal the direction of the link
 
