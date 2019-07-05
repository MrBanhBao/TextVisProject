d3.json('js/data/d3_result_data.json').then(function(d) {

    console.log(d);
    let years = d.years;
    //let yearData = d.filter(d => d.year === years[0])[0];
    console.log(years)

    let margin = {top: 10, right: 0, bottom: 18, left: 20};
    let width = 620 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;


    // SVG
    let svg = d3.select('#topvis')
        .append('svg')
        .attr('width', width)
        .attr('height', height);


    // Axis
    let yScale = d3.scaleLinear()
        .domain([100, 0])
        .range([0, height-margin.bottom]);

    let yTicks = d3.axisLeft(yScale)
        .ticks(10);

    let xScale = d3.scaleBand()
        .domain(years)
        .range([0, width-margin.left]);

    let xTicks = d3.axisBottom(xScale)
        .ticks(19);

    // Guides
    let xGuide = d3.select('#topvis svg')
        .append('g')
        .attr('transform', 'translate(' + (margin.left) + ',' + (height-margin.bottom) +')')
        .call(xTicks);

    let yGuide = d3.select('#topvis svg')
        .append('g')
        .attr('transform', 'translate('+ (margin.left+10) + ',' + (margin.top-10) +')')
        .call(yTicks);


    //
    let nest = d3.nest()
        .key(function(d) {
            return d.party
        })
        .entries(d.results);

    console.log(nest)

    // Define the line
    let valueLine = d3.line()
        .x(function(d) { return xScale(d.year)+margin.left+15; })
        .y(function(d) { return yScale(d.result); });
    // Draw the line
    svg.selectAll(".line")
        .data(nest)
        .enter()
        .append("path")
        .attr("class", function(d) {
            return 'line '+d.key.toLowerCase()
        })
        .attr("d", function(d){
            console.log(d)
            return valueLine(d.values);
        });
});