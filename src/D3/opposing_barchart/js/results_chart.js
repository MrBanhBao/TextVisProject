d3.json('js/data/d3_distance_result_data.json').then(function(d) {

    console.log(d)
    let years = d.map(d => d.year);
    let yearData = d.filter(d => d.year === years[0])[0];
    console.log(yearData)

    let margin = {top: 10, right: 10, bottom: 15, left: 10};
    let width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

};