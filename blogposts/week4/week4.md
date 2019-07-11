# Tinkering with Data and Visualisations
> **Date:** 07.07. *(Due: 09.07.)*  
> **Name:** Lasse, Hao, Lando 
> **Code:** [Analytics](https://github.com/MrBanhBao/TextVisProject), [Frontend](https://github.com/Lando-L/text_viz_app), [Backend](https://github.com/Lando-L/text_viz_backend)

----

## Intro
While the focus of our last weeks blog post lies on interactivity, this week is more about improving and integrating different visualizations in the Web Application.

## What we have achieved last week

## Visualization
Our existing visualizations got some upgrades and we came up with ideas and implementations for new ones.

The time bubble charts got some new features. First of all we used the hover functions now for click events. 
Clicking on something which is related to a specific party makes the selection permanent, until something else is clicked. 
This makes it possible to observe how certain terms of a party of a specific year change over time.

![time_bubbles_selection.gif](time_bubbles_selection.gif)

The second new feature is kind of more experimental: 
we added different modes for displaying the words, to evaluate what visually works best: 
1) „Mixed“ (normal: bubble+word), 
2) „None“ (no bubbles, all words have the same size), 
3) „WordCloud“ (no bubbles, words have different sizes). 

![time_bubbles_modes.gif](time_bubbles_modes.gif)

We think the normal „Mixed“ mode works best, because it contains the most information, but the „None“ mode has also a charming minimalist touch. 
Because we don't handle overlaps the „WordCloud“ mode is not very useful at all.

We have further expanded the graphs of readability and vocabulary data. 
Normalized scores for the different manifestos of parties over time, like readability, simpson index, number of words, number of sentences, average sentence lengths in words etc., can now be displayed for all parties as simple line charts. 
Parties can be removed by clicking on them. 

![readability.gif](readability.gif)

This makes it possible that one is not overwhelmed with the many lines. 
With this we noted that in general the length of manifestos for SPD and the Union parties becomes bigger over time and the readability shrinks while also the election result graphs are descending.

---

We also came up with an interactive visualisation to reason manifestos similarity
with the election results over time. With this visualisation we wanted to see which manifestos
are similar to each other and if parties with similar manifestos are forming coalitions.
Parties who formed a coalition for the current term have a greenish border around the similarity bars. 
For parties to form a coalition two or more parties have to have +50% of the election votes together.
That is why we also visualized the election results as a barplot for the chosen year. You can choose the year 
by using the slider. The corresponding results and similarities of the parties will be updated after choosing a year.
Because the barplot only show the election result of just one year, we also decided to add a linegraph on top of the
barchart so the development of the results can be seen faster, this could indicate if voters were happy
with the government of the last term.

![simiRes.gif](simiRes.gif)

Interesting would to find out why manifestos are similar or dissimilar to another. 
A closer look on the content of the manifestos could bring clarification on why manifestos are alike and what
topics were important for voters.

###  Manifesto Project
The [Manifesto Project](https://manifesto-project.wzb.eu/) (recommended by Juliane <- thank you) is a project 
which collects and analyzes parties' manifestos all over the world. The manifestos are unitized in "quasi-sentences"
which again are allocated in focal statements, like "Military: Positive", "Military: Negative'.
For example if the quasi-sentence speaks positively about the Military then this sentence is allocated with the "Military: Positive".

This focal statements are categorized in 7 different Domains:
* Domain 1: External Relations 
* Domain 2: Freedom and Democracy 
* Domain 3: Political System 
* Domain 4: Economy 
* Domain 5: Welfare and Quality of Life 
* Domain 6: Fabric of Society 
* Domain 7: Social Groups
each with about 10-20 statements with different codes. For instance "Environmental Protection" is coded as 501.

The Main-Dataset of this project provides us with the percentage of each statement for every annotated manifesto, that means
the percentage number shows the portion of sentences with statement S in the whole manifesto.

With this information we for example can show how important the Topic "Environmental Protection" had been for each party over time.
![per501](imgs/per501.png)

The Dataset also provides aggregated values like "rile" it shows how right(towards +100) or left(towards -100) is.
![rile](imgs/rile.png)

### Web Application
According to our proposed vision from the last blog post, we build the web application based upon three explicit views (Word centric search, Party centric search & Overview). The different views offer multiple entry points into the data, enabling the user to query the dataset for specific information. While we want to provide the user with three entry points into the data, we believe in having only a single entry point into the app. That means we aim to have clean and simple starting screen, that allows the user to explore the data choosing one of three entry points. Depending on the selected entry point, the results will be displayed accordingly.

So far we only managed to combine the *Word centric search* with the *Party centric search* into a single view. Since we have no experienced designer in our team, we ended up copying the design of the probably most popular search engine on the market.

![](web_application_1.png)

As mentioned earlier, depending on the kind of information the user is interested in, they can chose either to search for specific words they have in mind, or to search for a political party they are interested in. We already finished implementing the connection from the frontend to the server, but had yet no time to extract all the information from manifestos. Until now the query from the client is just echoed back and printed to the screen.

![](web_application_2.png)

![](web_application_3.png)

From the advanced D3 visualisation, only the bubble charts are fully implemented. Integrating the raw D3 javascript code into the React application, turned out to be a lot more time consuming than expected.

![](web_application_2.png)

### D3

## Next Steps 
For the next week, we plan to fully integrate our D3 visualisations into the web application. Furthermore want to finish the *Word centric search* and *Party centric search*, by presenting the queried results with charts and graphs.

Since this is already the last week before the final presentations, we cannot use all of our time only hacking our app, but we need to spare some time for the preparation of the poster as well.
