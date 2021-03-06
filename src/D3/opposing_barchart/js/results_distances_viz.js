
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

d3.json('js/data/d3_distance_result_data2.json').then(function(d) {
    let results = d.flatMap(d => d.results);
    let years = d.map(d => d.year);
    let parties = d[0].results.map(d => d.party.toLowerCase());

    let yearData = d.filter(d => d.year === years[0])[0];
    console.log(yearData)
    console.log(parties)

    /***
        /////////////////////////////////////////
        ////    START OPPOSING BARCHART     ////
        ////////////////////////////////////////
    **/

    let distancesData = d.map(yearData => {
            let distances = yearData.distances.map(distances => distances.distance)
            return distances
        }).flat();

    let marginOpposingBars = {top: 10, right: 0, bottom: 20, left: 0};

    let widthOpposingBars = 600 - marginOpposingBars.left - marginOpposingBars.right,
        heightOpposingBars = 400 - marginOpposingBars.top - marginOpposingBars.bottom;

    let barWidth = heightOpposingBars / yearData.distances.length,
        labelGap = 80,
        gap = 5;

    // Scaling
    let xScaleOppoBarChart = d3.scaleLinear()
        .domain([0, d3.max(distancesData)])
        .range([0, widthOpposingBars/2-labelGap]);

    let yScaleOppoBarChart = d3.scaleLinear()
        .domain([0, yearData.distances.length])
        .range([0, heightOpposingBars-marginOpposingBars.bottom]);


    //SVG
    let svgOpposingBar = d3.select('#vis')
        .append('svg')
        .attr('width', widthOpposingBars)
        .attr('height', heightOpposingBars);

    // Axis
    let xAxisLeftValues = d3.scaleLinear()
        .domain([d3.max(distancesData), 0])
        .range([0, widthOpposingBars/2-labelGap/2, ]);

    let xAxisLeftTicks = d3.axisBottom(xAxisLeftValues)
        .ticks(5);

    let xAxisRightValues = d3.scaleLinear()
        .domain([0, d3.max(distancesData)])
        .range([0, widthOpposingBars/2-labelGap/2]);

    let xAxisRightTicks = d3.axisBottom(xAxisRightValues)
        .ticks(5);


    // Opposing Barchar
    let highlight = function (c) {
        return function(d, i) {
            bar
                .filter(function(d, j) {
                    return i === j;
                })
                .attr('class', c)
                .classed('coalition', function (d) {
                    return d.coalition
                });
        };
    };

    let bar = svgOpposingBar.selectAll('g.bar')
        .data(yearData.distances)
        .enter()
        .append('g')
        .attr('class', 'bar')
        .classed('coalition', function (d) {
            return d.coalition
        })
        .attr("transform", function(d, i) {
            return "translate(0," + (yScaleOppoBarChart(i)) + ")";
        });




    // left bars
    let leftBarsGroups = bar.append('g')
        .attr('class', 'left-bar');


    leftBarsGroups.append('rect')
        .attr('class', function(d) {
            return d.label.split('-')[0].trim().toLowerCase()
        })
        .attr('width', function (d) {
            return xScaleOppoBarChart(d.distance)
        })
        .attr('height', barWidth-gap)
        .attr('x', function(d) {
            return (widthOpposingBars/2+marginOpposingBars.left-(labelGap/2))-xScaleOppoBarChart(d.distance)

        });

    leftBarsGroups.append('text')
        .attr('x', function(d) {
            return (widthOpposingBars+marginOpposingBars.left+marginOpposingBars.right)/2-labelGap/2/2
        })
        .attr('y', function(d) {
            bbox = this.parentNode.firstChild.getBBox();
            return bbox.y + bbox.height/1.5
        })
        .text(function(d) {
            return convertLabel(d.label.split('-')[0].trim().toLowerCase());
        });


    // right bars
    let rightBarsGroups = bar.append('g')
        .attr('class', 'right-bar');


    rightBarsGroups.append('rect')
        .attr('class', function(d) {
            return d.label.split('-')[1].trim().toLowerCase()
        })
        .attr('width', function (d) {
            return xScaleOppoBarChart(d.distance)
        })
        .attr('height', barWidth-gap)
        .attr('x', function(d) {
            return (widthOpposingBars/2+marginOpposingBars.left+(labelGap/2))

        });

    rightBarsGroups.append('text')
        .attr('x', function(d) {
            return (widthOpposingBars+marginOpposingBars.left+marginOpposingBars.right)/2+labelGap/2/2
        })
        .attr('y', function(d) {
            bbox = this.parentNode.firstChild.getBBox();
            return bbox.y + bbox.height/1.5
        })
        .text(function(d) {
            return convertLabel(d.label.split('-')[1].trim().toLowerCase())
        });

    //Interactive
    bar.on('mouseover', highlight('highlight bar'))
        .on('mouseout', highlight('bar'));


    // Guides
    let xGuideLeft = d3.select('#vis svg')
        .append('g')
        .attr('transform', 'translate('+ (marginOpposingBars.left) +','+ (heightOpposingBars-marginOpposingBars.bottom) +')')
        .call(xAxisLeftTicks);

    let xGuideRight = d3.select('#vis svg')
        .append('g')
        .attr('transform', 'translate('+ (widthOpposingBars/2+labelGap/2+(marginOpposingBars.left-1)) +','+ (heightOpposingBars-marginOpposingBars.bottom) +')')
        .call(xAxisRightTicks);

    // Legend and Infos
    let coalitionG = svgOpposingBar.append('g').attr('class', 'coal-legend');
    coalitionG.append('rect').attr('width', '15').attr('height', '12') ;
    coalitionG.append('text').text(': in coalition');

    svgOpposingBar.append('text')
        .attr('class', 'opp-info-text upper')
        .text('*small distance: similar');

    svgOpposingBar.append('text')
        .attr('class', 'opp-info-text lower')
        .text('*high distance: dissimilar');


    function refreshOpposingBars(yearData) {
        bar.data(yearData.distances)
            .classed('coalition', function (d) {
                return d.coalition
            });

        //left
        leftBarsGroups.select('rect')
            .data(yearData.distances)
            .transition()
            .duration(1000)
            .attr('width', function (d) {
                return xScaleOppoBarChart(d.distance)
            })
            .attr('height', barWidth-gap)
            .attr('x', function(d) {
                return (widthOpposingBars/2+marginOpposingBars.left-(labelGap/2))-xScaleOppoBarChart(d.distance)

            });

        // right bars
        rightBarsGroups.select('rect')
            .data(yearData.distances)
            .transition()
            .duration(1000)
            .attr('width', function (d, i) {
                return xScaleOppoBarChart(d.distance)
            })
            .attr('height', barWidth-gap)
            .attr('x', function(d) {
                return (widthOpposingBars/2+marginOpposingBars.left+(labelGap/2))

            });
    }

    /***
        /////////////////////////////////////////
        ////    END OPPOSING BARCHART       ////
        ////////////////////////////////////////
    **/


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
        .attr('height', heightResults+10);


    // Axis
    let yScaleLines = d3.scaleLinear()
        .domain([100, 0])
        .range([0, heightResults-marginResults.bottom]);

    let yTicks = d3.axisLeft(yScaleLines)
        .ticks(10);

    let xScaleLines = d3.scaleBand()
        .domain(years)
        .range([0, widthResults-marginResults.left]);

    let xTicks = d3.axisBottom(xScaleLines)
        .ticks(19);

    // Guides
    let xGuideResults = d3.select('#topvis svg')
        .append('g')
        .attr('transform', 'translate(' + (marginResults.left) + ',' + (heightResults - marginResults.bottom + 10) +')')
        .call(xTicks);

    let yGuideResults = d3.select('#topvis svg')
        .append('g')
        .attr('transform', 'translate('+ (marginResults.left+9) + ',' + (marginResults.top-10) +')')
        .call(yTicks);


    let nest = d3.nest()
        .key(function(d) {
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
                return yScaleLines(d.result)+10;
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
            .attr("cx", function(d) { return xScaleLines(d.year) + marginResults.left + 15 } )
            .attr("cy", function(d) { return yScaleLines(d.result) + 10 } )
            //.transition()
            //.duration(400)
            .attr("r", 4)
    }


    /// BAR CHART
    let xScaleResBars = d3.scaleBand()
        .domain(parties)
        .paddingInner(.1)
        .paddingOuter(.1)
        .range([0, widthResults/3]);

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
            console.log("height", d.party, yScaleLines(d.result));
            if (d.result) {
                return heightResults - yScaleLines(d.result) - marginResults.bottom + 10;
            } else {
                return 0;
            }
        });

    function refreshResBarChart(yearData) {
        console.log(yearData);
        //svgResults.selectAll('.resBars').remove();
        //let t = svgResults.select('g.resBars').data(yearData);
        //let t = svgResults.selectAll('resBars').data(yearData.results);
        //console.log(t);


        let bars = svgResults.select('.resBars');
        console.log(bars);
        console.log(bars.selectAll('rect'))

        bars.selectAll('rect')
            .data(yearData.results)
            .transition()
            .duration(400)
            .attr('y', function(d) {
                console.log('update', d);
                return yScaleLines(d.result)
            })
            .attr('height', function(d) {
                console.log("height", d.party, yScaleLines(d.result));
                if(d.result) {
                    return heightResults-yScaleLines(d.result)-marginResults.bottom + 10;
                } else {
                    return 0;
                }
            })
    }

    // Slider
    d3.select("#mySlider")
        .on("change", function(){
            let selectedValue = this.value;
            let year = years[selectedValue];
            yearData = d.filter(d => d.year === year)[0];
            refreshResBarChart(yearData);
            refreshLineChart(year);
            refreshOpposingBars(yearData);
        });
    //refreshResBarChart(yearData);
    refreshLineChart(years[0]);
});