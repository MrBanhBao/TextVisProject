d3.json('js/data/d3_result_data.json').then(function(d) {

    console.log(d);
    let years = d.years;
    //let yearData = d.filter(d => d.year === years[0])[0];
    console.log(years)

    let marginResults = {top: 10, right: 0, bottom: 18, left: 20};
    let widthResults = 620 - marginResults.left - marginResults.right,
        heightResults = 250 - marginResults.top - marginResults.bottom;


    // SVG
    let svgResults = d3.select('#topvis')
        .append('svg')
        .attr('width', widthResults)
        .attr('height', heightResults);


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
        .attr('transform', 'translate(' + (marginResults.left) + ',' + (heightResults-marginResults.bottom) +')')
        .call(xTicks);

    let yGuideResults = d3.select('#topvis svg')
        .append('g')
        .attr('transform', 'translate('+ (marginResults.left+10) + ',' + (marginResults.top-10) +')')
        .call(yTicks);


    //
    let nest = d3.nest()
        .key(function(d) {
            return d.party
        })
        .entries(d.results);

    console.log(nest)


    // Slider
    d3.select("#mySlider")
        .on("change", function(){
            let selectedValue = this.value;
            let year = years[selectedValue];
            refresh(year)
        });


    function refresh(selectedYear) {
        // Define the line
        console.log("yes")
        let valueLine = d3.line()
            .x(function(d) {
                return xScaleLines(d.year)+marginResults.left+15;
            })
            .y(function(d) {
                return yScaleLines(d.result);
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
                console.log(d)
                let dFilteredValues = d.values.filter(function (d) {
                    return d.year <= selectedYear
                });
                console.log(dFilteredValues);
                return valueLine(dFilteredValues);
            });
    }

    refresh(years[0])
});