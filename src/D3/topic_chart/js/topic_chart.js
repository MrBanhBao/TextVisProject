function convertLabel(label) {
    switch (label) {
        case 'cducsu':
            return 'Union';
        case 'spd':
            return 'SPD';
        case 'fdp':
            return 'FDP';
        case 'gruene':
            return 'Grüne';
        case 'linke':
            return 'Linke';
        case 'afd':
            return 'AfD';

    }
}

function getFilteredTopics(topics, year, party) {
    return topics.filter(topic => topic.party_name.toLowerCase() === party.toLowerCase() && topic.year === year)
}


function getSelectedPartiesTopic(topics, partyA, partyB) {
    let selectedPartiesTopics= topics.filter(topic => topic.party_name.toLowerCase() === partyA.toLowerCase() ||
        topic.party_name.toLowerCase() === partyB.toLowerCase());
    return selectedPartiesTopics;
}


function getTopTopics(topics, partyA, partyB, n = 15) {
    let selectedPartiesTopics = getSelectedPartiesTopic(topics, partyA, partyB);

    let obj = {};
    selectedPartiesTopics.forEach(a => {
        Object.keys(a).forEach(k => {
            if (a[k] && typeof a[k] === 'number' && k != 'rile' && k != 'party_name' && k != 'peruncod' && k != 'year') {
                obj[k] = obj[k] ? obj[k] + a[k] : a[k]
            }
        })
    });
    return Object.keys(obj).sort(function (a, b) {
        return obj[b] - obj[a]
    }).slice(0, n)
}


function getTopicPercentages(topics) {
    let percentages = [];
    topics.forEach(a => {
        Object.keys(a).forEach(k => {
            if (a[k] && typeof a[k] === 'number' && k != 'rile' && k != 'party_name' && k != 'peruncod' && k != 'year') {
                percentages.push(a[k])
            }
        })
    });
    return percentages
}


d3.json('js/data/topics_data2.json').then(function (d) {
    console.log(d);
    let results = d.data.flatMap(d => d.results);
    let years = d.data.map(d => d.year);
    let parties = d.data[0].results.map(d => d.party.toLowerCase());

    let yearData = d.data.filter(d => d.year === years[0])[0];
    console.log(yearData)
    let topics = d.data.flatMap(d => d.topics)
    let topicMapping = d.topic_mapping;

    let partyA = 'SPD',
        partyB = 'CDUCSU';

    //let selectedPartyTopics = d.data.flatMap(d => d.topics.filter(topic => topic.party_name.toLowerCase() === partyA.toLowerCase() ||
    //    topic.party_name.toLowerCase() === partyB.toLowerCase()));

    let topicPercentages = getTopicPercentages(topics);
    let topTopics = getTopTopics(topics, partyA, partyB, 15);

    console.log(topTopics);
    console.log(topics.filter(topic => topic.party_name.toLowerCase() === partyA.toLowerCase() ||
        topic.party_name.toLowerCase() === partyB.toLowerCase()));

    /***
     /////////////////////////////////////////
     ////     START  OPPOSING CHART       ////
     ////////////////////////////////////////
     **/

    let marginOpposingBars = {top: 10, right: 0, bottom: 20, left: 0};

    let widthOpposingBars = 600 - marginOpposingBars.left - marginOpposingBars.right,
        heightOpposingBars = 400 - marginOpposingBars.top - marginOpposingBars.bottom;

    let barWidth = heightOpposingBars / topTopics.length,
        labelGap = 50,
        gap = 5;

    // Scaling
    let xScaleOppoBarChart = d3.scaleLinear()
        .domain([0, d3.max(topicPercentages)])
        .range([0, widthOpposingBars/2-labelGap]);

    let yScaleOppoBarChart = d3.scaleLinear()
        .domain([0, topTopics.length])
        .range([0, heightOpposingBars-marginOpposingBars.bottom]);


     //SVG
    let svgOpposingBar = d3.select('#vis')
        .append('svg')
        .attr('width', widthOpposingBars)
        .attr('height', heightOpposingBars);

    // Axis
    let xAxisLeftValues = d3.scaleLinear()
        .domain([d3.max(topicPercentages), 0])
        .range([0, widthOpposingBars/2-labelGap/2, ]);

    let xAxisLeftTicks = d3.axisBottom(xAxisLeftValues)
        .ticks(5);

    let xAxisRightValues = d3.scaleLinear()
        .domain([0, d3.max(topicPercentages)])
        .range([0, widthOpposingBars/2-labelGap/2]);

    let xAxisRightTicks = d3.axisBottom(xAxisRightValues)
        .ticks(5);

     // Guides
    let xGuideLeft = d3.select('#vis svg')
        .append('g')
        .attr('transform', 'translate('+ (marginOpposingBars.left) +','+ (heightOpposingBars-marginOpposingBars.bottom) +')')
        .call(xAxisLeftTicks);

    let xGuideRight = d3.select('#vis svg')
        .append('g')
        .attr('transform', 'translate('+ (widthOpposingBars/2+labelGap/2+(marginOpposingBars.left-1)) +','+ (heightOpposingBars-marginOpposingBars.bottom) +')')
        .call(xAxisRightTicks);


    // Opposing Barchar
    let highlight = function (c) {
        return function(d, i) {
            bar
                .filter(function(d, j) {
                    return i === j;
                })
                .attr('class', c);
        };
    };

    // INIT PHASE
    let bar = svgOpposingBar.selectAll('g.bar')
        .data(topTopics)
        .enter()
        .append('g')
        .attr('class', 'bar')
        .attr("transform", function(d, i) {
            return "translate(0," + (yScaleOppoBarChart(i)) + ")";
        });

    bar.append('text')
        .attr('x', function(d) {
            return (widthOpposingBars+marginOpposingBars.left+marginOpposingBars.right)/2
        })
        .attr('y', function(d) {
            bbox = this.parentNode.firstChild.getBBox();
            return bbox.y + 12.5
        })
        .text(function(d) {
            return d;
        });

    let tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('display', 'none');

    bar.on('mouseover', highlight('highlight bar'))
        .on('mouseout', highlight('bar'));

    d3.selectAll('.bar text')
        .on('mouseover', function (d) {
            let tip = d3.select('.tooltip').node();
            let textElement = d3.select(this).node();
            console.log(tip)
            tooltip
                .text(topicMapping[d])
                .style('display', 'inline')
                .style("left", (textElement.getBoundingClientRect().x + textElement.getBoundingClientRect().width/2 - tip.getBoundingClientRect().width/2) + "px")
                .style("top", textElement.getBoundingClientRect().y - 20 +"px");
        })
        .on('mouseout', function (d) {
            tooltip
                .style("display", "none");
        });
     // left bars
    let leftTopicsData = getFilteredTopics(topics, years[0], partyA)[0];
    console.log(leftTopicsData)

    let leftBarsGroups = bar.append('g')
        .attr('class', 'left-bar');


    leftBarsGroups.append('rect')
        .attr('class', partyA.toLowerCase())
        .attr('width', function (d) {
            return xScaleOppoBarChart(leftTopicsData[d])
        })
        .attr('height', barWidth-gap)
        .attr('x', function(d) {
            return (widthOpposingBars/2+marginOpposingBars.left-(labelGap/2))-xScaleOppoBarChart(leftTopicsData[d])

        });

    leftBarsGroups.append('text')
        .attr('class', 'left barvalue')
        .attr('x', function(d) {
            return (widthOpposingBars/2+marginOpposingBars.left-(labelGap/2))-xScaleOppoBarChart(leftTopicsData[d]) -5
        })
        .attr('y', function(d) {
            bbox = this.parentNode.firstChild.getBBox();
            return bbox.y + 12.5
        })
        .text(function (d) {
            if (leftTopicsData[d] != 0) {
                return leftTopicsData[d].toFixed(2);
            }
        });



    // right bars
    let rightTopicsData = getFilteredTopics(topics, years[0], partyB)[0];

    let rightBarsGroups = bar.append('g')
        .attr('class', 'right-bar');


    rightBarsGroups.append('rect')
        .attr('class', partyB)
        .attr('width', function (d) {
            return xScaleOppoBarChart(rightTopicsData[d]);
        })
        .attr('height', barWidth-gap)
        .attr('x', function(d) {
            return (widthOpposingBars/2+marginOpposingBars.left+(labelGap/2))

        });

    rightBarsGroups.append('text')
        .attr('class', 'right barvalue')
        .attr('x', function(d) {
            return (widthOpposingBars/2+marginOpposingBars.left+(labelGap/2)) + xScaleOppoBarChart(rightTopicsData[d]) + 5;
        })
        .attr('y', function(d) {
            bbox = this.parentNode.firstChild.getBBox();
            return bbox.y + 12.5
        })
        .text(function (d) {
            if (rightTopicsData[d] != 0) {
                return rightTopicsData[d].toFixed(2);
            }
        });

    /***
     /////////////////////////////////////////
     ////     START  RESULTS CHART       ////
     ////////////////////////////////////////
     **/



    let marginResults = {top: 20, right: 0, bottom: 18, left: 20};
    let widthResults = 620 - marginResults.left - marginResults.right,
        heightResults = 250 - marginResults.top - marginResults.bottom;


    // SVG
    let svgResults = d3.select('#topvis')
        .append('svg')
        .attr('width', widthResults)
        .attr('height', heightResults + 10);


    // Axis
    let yScaleLines = d3.scaleLinear()
        .domain([100, 0])
        .range([0, heightResults - marginResults.bottom]);

    let yTicks = d3.axisLeft(yScaleLines)
        .ticks(10);

    let xScaleLines = d3.scaleBand()
        .domain(years)
        .range([0, widthResults - marginResults.left]);

    let xTicks = d3.axisBottom(xScaleLines)
        .ticks(19);

    // Guides
    let xGuideResults = d3.select('#topvis svg')
        .append('g')
        .attr('transform', 'translate(' + (marginResults.left) + ',' + (heightResults - marginResults.bottom + 10) + ')')
        .call(xTicks);

    let yGuideResults = d3.select('#topvis svg')
        .append('g')
        .attr('transform', 'translate(' + (marginResults.left + 9) + ',' + (marginResults.top - 10) + ')')
        .call(yTicks);


    let nest = d3.nest()
        .key(function (d) {
            return d.party
        })
        .entries(results);

    // !!!!! LINE CHART !!!!!!!
    function refreshLineChart(selectedYear) {
        // Define the line
        let valueLine = d3.line()
            .x(function (d) {
                return xScaleLines(d.year) + marginResults.left + 15;
            })
            .y(function (d) {
                return yScaleLines(d.result) + 10;
            });

        svgResults.selectAll(".line").remove();


        svgResults.selectAll(".line")
            .data(nest)
            .enter()
            .append("path")
            .attr("class", function (d) {
                return 'line ' + d.key.toLowerCase()
            })
            .attr("d", function (d) {
                let dFilteredValues = d.values.filter(function (d) {
                    return d.year <= selectedYear
                });
                return valueLine(dFilteredValues);
            });


        let dFilteredValues = results.filter(function (d) {
            return d.year <= selectedYear
        });

        svgResults.selectAll(".dot").remove();

        svgResults
            .append("g")
            .attr("class", "dots")
            .selectAll("dot")
            .data(dFilteredValues)
            .enter()
            .append("circle")
            .attr("class", function (d) {
                return 'dot ' + d.party.toLowerCase()
            })
            .attr("cx", function (d) {
                return xScaleLines(d.year) + marginResults.left + 15
            })
            .attr("cy", function (d) {
                return yScaleLines(d.result) + 10
            })
            //.transition()
            //.duration(400)
            .attr("r", 4)
    }


    /// BAR CHART
    let xScaleResBars = d3.scaleBand()
        .domain(parties)
        .paddingInner(.1)
        .paddingOuter(.1)
        .range([0, widthResults / 3]);

    let barChart = svgResults.append('g')
        .attr('transform', 'translate(' + (widthResults / 3 + 15 + marginResults.left) + ',' + 0 + ')')
        .attr('class', 'resBars')
        .selectAll('.resBar')
        .data(yearData.results)
        .enter()
        .append('rect')
        .attr('class', function (d) {
            return 'resBar ' + d.party.toLowerCase()
        })
        .transition()
        .attr('width', function (d) {
            return xScaleResBars.bandwidth();
        })
        .attr('height', function (d) {
            return 0;
        })
        .attr('x', function (d) {
            //console.log('xbars', xScaleResBars(d.party.toLowerCase()));
            return xScaleResBars(d.party.toLowerCase());
        })
        .attr('y', function (d) {
            return heightResults - marginResults.bottom + 10
        });

    barChart
        .transition()
        .duration(500)
        .attr('y', function (d) {
            return yScaleLines(d.result)
        })
        .attr('height', function (d) {
            if (d.result) {
                return heightResults - yScaleLines(d.result) - marginResults.bottom + 10;
            } else {
                return 0;
            }
        });

    function refreshResBarChart(yearData) {
        let bars = svgResults.select('.resBars');

        bars.selectAll('rect')
            .data(yearData.results)
            .transition()
            .duration(400)
            .attr('y', function (d) {
                return yScaleLines(d.result)
            })
            .attr('height', function (d) {
                if (d.result) {
                    return heightResults - yScaleLines(d.result) - marginResults.bottom + 10;
                } else {
                    return 0;
                }
            })
    }

    // Slider
    d3.select("#mySlider")
        .on("change", function () {
            let selectedValue = this.value;
            let year = years[selectedValue];
            yearData = d.data.filter(d => d.year === year)[0];
            refreshResBarChart(yearData);
            refreshLineChart(year);
        });
    //refreshResBarChart(yearData);
    refreshLineChart(years[0]);

});