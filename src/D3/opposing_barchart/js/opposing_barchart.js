
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
    // console.log(d);

    let years = d.map(d => d.year);
    let yearData = d.filter(d => d.year === years[0])[0];
    //console.log(yearData);

    let distancesData = d.map(yearData => {
            let distances = yearData.distances.map(distances => distances.distance)
            return distances
        }).flat();

    let margin = {top: 10, right: 0, bottom: 20, left: 0};

    let width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let barWidth = height / yearData.distances.length,
        labelGap = 80,
        gap = 5;

    // Scaling
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(distancesData)])
        .range([0, width/2-labelGap]);

    let yScale = d3.scaleLinear()
        .domain([0, yearData.distances.length])
        .range([0, height-margin.bottom]);


    //SVG
    let svg = d3.select('#vis')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Axis
    let xAxisLeftValues = d3.scaleLinear()
        .domain([d3.max(distancesData), 0])
        .range([0, width/2-labelGap/2, ]);

    let xAxisLeftTicks = d3.axisBottom(xAxisLeftValues)
        .ticks(5);

    let xAxisRightValues = d3.scaleLinear()
        .domain([0, d3.max(distancesData)])
        .range([0, width/2-labelGap/2]);

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

    let bar = svg.selectAll('g.bar')
        .data(yearData.distances)
        .enter()
        .append('g')
        .attr('class', 'bar')
        .classed('coalition', function (d) {
            return d.coalition
        })
        .attr("transform", function(d, i) {
            return "translate(0," + (yScale(i)) + ")";
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
            return (width/2+margin.left-(labelGap/2))-xScale(d.distance)

        });

    leftBarsGroups.append('text')
        .attr('x', function(d) {
            return (width+margin.left+margin.right)/2-labelGap/2/2
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
            return (width/2+margin.left+(labelGap/2))

        });

    rightBarsGroups.append('text')
        .attr('x', function(d) {
            return (width+margin.left+margin.right)/2+labelGap/2/2
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
            refresh(yearData)
        });


    // Guides
    let xGuideLeft = d3.select('#vis svg')
        .append('g')
        .attr('transform', 'translate('+ (margin.left) +','+ (height-margin.bottom) +')')
        .call(xAxisLeftTicks);

    let xGuideRight = d3.select('#vis svg')
        .append('g')
        .attr('transform', 'translate('+ (width/2+labelGap/2+(margin.left-1)) +','+ (height-margin.bottom) +')')
        .call(xAxisRightTicks);


    function refresh(yearData) {
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
                return xScale(d.distance)
            })
            .attr('height', barWidth-gap)
            .attr('x', function(d) {
                return (width/2+margin.left-(labelGap/2))-xScale(d.distance)

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
                return (width/2+margin.left+(labelGap/2))

            });
    }

});