d3.json('js/data/d3_distance_result_data.json').then(function(d) {

    console.log(d)
    let years = d.map(d => d.year);
    let yearData = d.filter(d => d.year === years[0])[0];
    console.log(yearData)

    let margin = {top: 10, right: 0, bottom: 15, left: 0};
    let width = 600 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;


    //SVG
    let svg = d3.select('#topvis')
        .append('svg')
        .attr('width', width)
        .attr('height', height);



});