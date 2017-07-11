/*
    Contains the JSON data
 */
var savedData;

/*
Contains the original type and chromosome data
 */
var newDataForType = [];
var newDataForChromosome = [];

/*
Contains data based on selection on Either View
 */
var latestChromosomeView = [];
var latestTypeView = [];


var width = 300;
var height = 500;


/*

 Search for a field in the object
 @param: data - array list of the data
         key - the field to sort on
         searchString - search the field based on this string
 */
var searchInObject = function(data,key,searchString){


    for(var i=0;i<data.length;i++){

        if(data[i][key] === searchString)
            return i;
    }

    return -1;

};

/*

    Sorting Function
    @param: data - array list of the data
            key - the field to sort on

 */

var sorted = function(data,key){



    data.sort(function (a,b) {

        return a[key] - b[key];
    });

    return data;
};

/*
    Creates a new list with the selected option from the UI
    @param: data - array list of the data
            key - the field on which to filter the list
            criteria - the value of the filed
 */
var newList = function (data,key,criteria) {

    var newVariable = [];

    data.forEach(function(d){

        var newList = d.objects.filter(function(e){

            return e[key] === criteria;
        });

        if((newList.length>0)){

            newVariable.push({name: d.name, objects: newList});
        }

    });

    newVariable = sorted(newVariable);

    return newVariable;
};

/*
    Handles Multiple Selection
    @param: key1 - array list of the data
            key2 - the field to sort on
            criteria1 - search string for key1
            criteria2 - search string for key2
 */

var newListForMultipleSelection = function(key1,key2,criteria1,criteria2){

    //filter the list when both the criteria match
    var list = savedData.filter(function(d,i){


        return d[key1]===criteria1 && d[key2]===criteria2;
    });

    console.log(list);
    return [{name: criteria1,objects:list[0]},{name:criteria2,objects: list}];
};

/*

    Handles Type View
 */

var typePieChart = function (data) {

    var svg = d3.select("#typeOverview"),
        width = 300,
        height = 300,
        radius = Math.min(width, height) / 2,
        g = svg;

    var color = d3.scaleOrdinal(["rgba(75, 91, 195, 0.5 )", "rgba(221, 33, 83, 0.2)", "rgba(229, 117, 222, 0.6)"]);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.objects.length;});

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var arc = g.selectAll(".arc")
        .data(pie(data));

    var pathEnter = arc.enter()
        .append('g')
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr('class','arc');

    arc.exit().remove();

    pathEnter.append('path');
    pathEnter.append('text');

    arc = arc.merge(pathEnter);

    arc.select('path')
        .classed('selected',false)
        .on('mouseover',function(){

            d3.select(this)
                .style('cursor','pointer')
                .classed('hoverSelection',true);
        })
        .on('mouseleave',function(){

            d3.select(this)
                .classed('hoverSelection',false);
        })
        .on('click', function(){

            var criteria = this.id;

            d3.selectAll('.selected')
                .classed('selected', false);

            d3.select(this)
                .classed('selected',true);

            var ifSelected = d3.select('.selection').empty();

            if(ifSelected) {

                latestChromosomeView = newList(newDataForChromosome, 'type', criteria);
                chromosomeView(latestChromosomeView);
            }
            else {

                var chromosomeCriteria = d3.select('.selection').data()[0].name;

                var list = newListForMultipleSelection('chromosome','type',chromosomeCriteria,criteria);

                chromosomeView([list[0]]);
                typePieChart([list[1]]);
            }

        })
        .attr("d", path)
        .attr("fill", function(d,i) { return color(i); })
        .attr("id",function(d){

            return d.data.name;
        });

    arc.select('text')
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .text(function(d) { return d.data.objects.length; });

    /*
    Legend for the Pie Chart
     */
    var legendG = svg.selectAll(".legend")
        .data(pie(data));

    var legendEnter = legendG
        .enter().append("g")
        .attr("transform", function(d,i){
            return "translate(" + (width + 180 - 110) + "," + (i * 15 + 20) + ")"; // place each legend on the right and bump each one down 15 pixels
        })
        .attr("class", "legend");

    legendG.exit().remove();

    legendEnter.append('rect');
    legendEnter.append('text');

    legendG = legendG.merge(legendEnter);

    legendG.select("rect") // make a matching color rect
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d, i) {
            return color(i);
        });

    legendG.select("text") // add the text
        .text(function(d){
            return d.data.name;
        })
        .attr("y", 10)
        .attr("x", 11);
};

/*
    Handles the Chromosome View
 */

var chromosomeView = function(data){


    var padding = 3;

    var rectwidth = (width-padding);
    var rectHeight = (height-padding)/data.length;

    var rect = d3.select("#chromosomeOverview")
        .selectAll("g")
        .data(data);


    rect.exit().remove();

    var rectEnter = rect.enter()
        .append('g');

    rectEnter.append('rect');
    rectEnter.append('text');

    rect = rect.merge(rectEnter);

    rect
        .select('rect')
        .attr('x', function(d){

            return 0;
        })
        .attr('y', function(d,i){

            return i*rectHeight;
        })
        .classed('custom-rect',true)
        //.transition()
        //.duration(3000)
        .attr('width',rectwidth)
        .attr('height', rectHeight)
        .attr("id",function(d){

            return d.name;
        })
        .classed('selection',false)
        .on('mouseover', function(d){

            d3.select(this)
                .style('cursor','pointer')
                .classed('hoverSelection',true);
        })
        .on('mouseleave', function(d){

            d3.select(this)
                .classed('hoverSelection',false);
        })
        .on('click', function(d){

            d3.selectAll('.selection')
                .classed('selection',false);
            d3.select(this)
                .classed('selection',true);

            var criteria = this.id;

            var ifSelected = d3.select('.selected').empty();

            if(ifSelected) {
                latestTypeView = newList(newDataForType, 'chromosome', criteria);
                typePieChart(latestTypeView);
            }
            else {

                var typeCriteria = d3.select('.selected').data()[0].data.name;

                var list = newListForMultipleSelection('chromosome','type',criteria,'single base substitution',typeCriteria);

                chromosomeView([list[0]]);
                typePieChart([list[1]]);
            }

        });


    rect
        .select('text')
        .attr('dx',function(d,i){

            return rectwidth/2;
        })
        .attr('dy', function(d,i){

            return  padding+i*rectHeight + rectHeight/2;
        })
        .classed('text',true)
        .text(function(d){

                return d.name;

        });

};

var clearAllFilters = function () {

    typePieChart(newDataForType);
    chromosomeView(newDataForChromosome);
};

/*
    Retrieving the Data using the API
 */
d3.json("https://dcc.icgc.org/api/v1/projects/GBM-US/mutations?field=id,mutation,type,chromosome,start,end&size=100&order=desc", function(error, data){

    savedData = data.hits;

    savedData.forEach(function(d){

        var flag = searchInObject(newDataForType,'name',d.type);
        var chromosomeFlag = searchInObject(newDataForChromosome,'name',d.chromosome);

        if(flag !== -1) {

            newDataForType[flag].objects.push(d);
        }
        else {

            newDataForType.push({name: d.type, objects: [d]});
        }

        if(chromosomeFlag !== -1){

            newDataForChromosome[chromosomeFlag].objects.push(d);
        }
        else{

            newDataForChromosome.push({name: d.chromosome, objects: [d]});
        }

    });

    latestChromosomeView = newDataForChromosome = sorted(newDataForChromosome,'name');
    latestTypeView = newDataForType = sorted(newDataForType, 'name');

    typePieChart(latestTypeView);
    chromosomeView(latestChromosomeView);

    //If data does not load, error handling
    if(error)
        throw error;
});
