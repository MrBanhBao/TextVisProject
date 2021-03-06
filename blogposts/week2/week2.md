# First Insights
> **Date:** 24.06. *(Due: 24.06.)*  
> **Name:** Lasse, Lando, Hao  
----

## Introduction
For this week we actually wanted to analyze the outcome of the last federal
election. But we noticed that the evolution of the manifestos over the time is
much more important for our long term goal. It also shows a clearer picture over
all the data we gathered. That is why focused on visualisations and analysis of
the manifestos over time. 

## Working results:
In this section we want to present our first visualisations ideas and approaches.

### Elections Results
We start with an easy overview of the election results of all past federal elections:

#### 1. Elections over time
![election results](imgs/results.png)

Here you can see that the traditional "Volksparteien" loses more votes over time in general.
This plot also shows that the "Volksparteien" loses uncommonly more votes whenever a new party has been established.

![election results](imgs/lesbarkeit.png)

As the previous plot this plots show the election result over time. The brighter graph represents a normalized readability score using inverted Coleman Liau readability. 
The the more readable the text is, the higher the score. Some parties like FDP have a more stable readability over time, while the score is more different for CDU and SPD.
It is hard to see if there is any correlation between the readabilty and the election result. This is also different for each party.

#### 2. Wordclouds
Traditional TD-IDF WordCloud             |  WordCloud using TF-IDF and election results
:-------------------------:|:-------------------------:
![](imgs/wordcloud11.png)  |  ![](imgs/wordcloud21.png)
![](imgs/wordcloud12.png)  |  ![](imgs/wordcloud22.png)
![](imgs/wordcloud13.png)  |  ![](imgs/wordcloud23.png)
![](imgs/wordcloud14.png)  |  ![](imgs/wordcloud24.png)
![](imgs/wordcloud15.png)  |  ![](imgs/wordcloud25.png)
![](imgs/wordcloud16.png)  |  ![](imgs/wordcloud26.png)

The left column of graphics are just usual word cloud applied on the TF-IDF-score for each word for the federal election year 2017. 
The visualizations on the right are showing a score which is also dependend on the election result for the year 2017 as well. For each term the TF-IDF-value is multiplied by the election result of a party. 
Then the sum for a term over all parties is computed, which is used to normalize the previously computed value. This means, words that are often used by more successfull parties but which are also specific for a choosen party, get the highest scores.
This obviously leads to another selection of words for each party in the world cloud.


##### Sizemap
![election results](imgs/sizemap.png)

The 'heatmap' shows for each federal election year the sum of the terms from all parties, which is represented by the circle size. 
The circle color represents the party which has the highest TF-IDF value for this term. For example we can see in this visualization that 'Klimaschutz' is on the political agenda since the last 7 election periods. 
While it was initially adressed by CDU and FDP it becomes more relevant with 'Die Grünen'.

##### Piemap
![election results](imgs/piemap.png)

This 'piemap' works similar to the last seen visualisation but instead of showing just the party which has most contributed to the TF-IDF-sum of a specific term, we can see the distributions for the terms as small pie diagrams. 
The size again represents the overall specificity for the election year. Size is weighted different in this, leading to different sized circles, but the ratios are retained.

##### Document Vector UMAP Reduction
![UMAP Reduction](imgs/UMAP.png)

We used TF-IDF-Vectors as document vectors for all federal manifestos, reduced their dimension with UMAP and generated a scatter plot from the results. Colors are representing the partie's colors and the election result is mapped to the circle size. The label size containing the election year represents the Coleman Liau readability.
While it is still hard to see if there is a correlation between readability and result we can identify easily the clusters for the parties. Maybe the most interesting thing is the location for AFD at the year 2013 near to the FDP. This is the year in which FDP got less than 5% of the votes and the AFD had a neo liberalism focus under Bern Lucke's leadership.

#### 4. Manifesto's Distances
We wanted to see how similar the manifestos were particular election years and how they developed over the years.
For this purpose we trained a word2vec word embedding with 100 dimensions with all manifestos and summed all word vectors which
occurred in each manifesto to get a document vector for each manifesto.
We then calculated the cosine distance of each manifesto of two chosen parties over the election years.

![Distance CDU SPD](imgs/dist-cdu-spd.png)
![Distance CDU SPD](imgs/dist-cdu-fdp.png)
![Distance CDU SPD](imgs/dist-spd-gruene.png)

Each bar on the x-axis represents the distance of two manifestos for the corresponding election year.
The smaller or closer the two different colored bars are, the more similar the two compared manifestos are. 

## Learnings
We identified two major kinds of visualisations.
The first one consists of visualisations showing a broader view over the data, for instance the above shown Sizemap/Piemap and Document Vector UMAP Reduction.
The other ones showing differences between two manifestos, years or parties, like the manifesto's distance and wordclouds.

When interactivity is introduced into the visualisations which just shows differences between parties, manifestos or years,
it also could transport information in a broader way. This is the reason why we will focus on interactive visualisations in the coming weeks.

## What's next
In this week we present simple visualisations which communicate only one or few information in a static way.
In the coming week we would like to experiment more with interactivity to give the visualisations a more explorative flavour.
Therefore we wanted to improve some of the introduced visulisations by adding interactivity to them.
Before we can start with it we would like to discuss with our supervisor about most promising approaches and opportunities.