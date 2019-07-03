
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

d3.json('js/data/d3_distance_result_data.json').then(function(d) {

    //const selectedYear = 2017;

    console.log(d)
    let years = d.map(d => d.year);
    let yearData = d.filter(d => d.year === years[0])[0];
    console.log(yearData)

    let distancesData = d.map(yearData => {
            let distances = yearData.distances.map(distances => distances.distance)
            return distances
        }).flat();

    let margin = {top: 10, right: 10, bottom: 15, left: 10};

    let width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let barWidth = height / yearData.distances.length,
        gap = 5;

    // Scaling
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(distancesData)])
        .range([0, width/2]);

    let yScale = d3.scaleLinear()
        .domain([0, yearData.distances.length])
        .range([0, height]);


    //SVG
    let svg = d3.select('#vis')
        .append('svg')
        .attr('width', 600)
        .attr('height', 400);

    // Axis
    let xAxisValues = d3.scaleLinear()
        .domain([-d3.max(distancesData), d3.max(distancesData)])
        .range([0, width]);

    let xAxisTicks = d3.axisBottom(xAxisValues)
        .ticks(10);

    // Slider



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

    let bar = svg.selectAll('g.bar')
        .data(yearData.distances)
        .enter()
        .append('g')
        .attr('class', 'bar')
        .classed('coalition', function (d) {
            return d.coalition
        })
        .attr("transform", function(d, i) {
            return "translate(0," + (yScale(i) + margin.top) + ")";
        });




    // left bars
    let leftBarsGroups = bar.append('g')
        .attr('class', 'left-bar')


    leftBarsGroups.append('rect')
        .attr('class', function(d) {
            return d.label.split('-')[0].trim().toLowerCase()
        })
        .attr('width', function (d) {
            return xScale(d.distance)
        })
        .attr('height', barWidth-gap)
        .attr('x', function(d) {
            return (width/2+margin.left)-xScale(d.distance)

        });

    leftBarsGroups.append('text')
        .attr('x', function(d) {
            bbox = this.parentNode.firstChild.getBBox();
            return bbox.x + bbox.width/2
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
            return xScale(d.distance)
        })
        .attr('height', barWidth-gap)
        .attr('x', function(d) {
            return (width/2+margin.left)

        });

    rightBarsGroups.append('text')
        .attr('x', function(d) {
            bbox = this.parentNode.firstChild.getBBox();
            return bbox.x + bbox.width/2
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
        .on('mouseout', highlight('bar'))


    // Slider
    d3.select("#mySlider")
        .on("change", function(){
            let selectedValue = this.value;
            let year = years[selectedValue]
            yearData = d.filter(d => d.year === year)[0];
            console.log(yearData);
            refresh(yearData)
        });


    //Axis
    let xGuide = d3.select('#vis svg')
        .append('g')
        .attr('transform', 'translate('+ margin.left +','+ (height+6) +')')
        .call(xAxisTicks);


    function refresh(yearData) {
        console.log('refresh', yearData.distances)
        bar.data(yearData.distances)
            .classed('coalition', function (d) {
                return d.coalition
            });

        console.log(bar);
        //left
        leftBarsGroups.select('rect')
            .data(yearData.distances)
            .transition()
            .duration(1000)
            .attr('width', function (d, i) {
                console.log('rect', i, d);
                return xScale(d.distance)
            })
            .attr('height', barWidth-gap)
            .attr('x', function(d) {
                return (width/2+margin.left)-xScale(d.distance)

            });
        console.log(leftBarsGroups.selectAll('rect'))


        leftBarsGroups.selectAll('text')
            .data(yearData.distances)
            .enter()
            .transition()
            .duration(1000)
            .attr('x', function(d) {
                console.log('text', d);
                if (d) {
                    bbox = this.parentNode.firstChild.getBBox();
                    return bbox.x + bbox.width/2
                }
            })
            .attr('y', function(d) {
                if(d) {
                    bbox = this.parentNode.firstChild.getBBox();
                    return bbox.y + bbox.height/1.5
                }
            });


        // right bars
        rightBarsGroups.select('rect')
            .data(yearData.distances)
            .transition()
            .duration(1000)
            .attr('width', function (d, i) {
                return xScale(d.distance)
            })
            .attr('height', barWidth-gap)
            .attr('x', function(d) {
                return (width/2+margin.left)

            });

        rightBarsGroups.selectAll('text')
            .data(yearData.distances)
            .transition()
            .duration(1000)
            .attr('x', function(d) {
                if (d) {
                    bbox = this.parentNode.firstChild.getBBox();
                    return bbox.x + bbox.width/2
                }
            })
            .attr('y', function(d) {
                if(d) {
                    bbox = this.parentNode.firstChild.getBBox();
                    return bbox.y + bbox.height/1.5
                }
            });
    }

});