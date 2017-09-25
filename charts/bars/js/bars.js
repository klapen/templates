var utils = {
    translation: function(x, y) {
        return 'translate(' + x + ',' + y + ')';
    },
    parentWidth: function(elem) {
        return elem.parentElement.clientWidth;
    },
    widthCalc: function(id) {
        return this.parentWidth(document.getElementById(id))
    },
    parentHeight: function(elem) {
        return elem.parentElement.clientHeight;
    },
    heightCalc: function(id) {
        return this.parentHeight(document.getElementById(id));
    }
}

var barras = {
    loadDataFromFile: function(url,graph){
	var that = this;
	
	function type(d) {
	    d.value = +d.value; // coerce to number
	    return d;
	};
	var ext = url.split('.')[1];
	if (ext == 'tsv'){
	    d3.tsv(url, type, function(error, data) {
		that.updateData(data,graph);
	    });
	}else if(ext == 'csv'){
	    d3.csv(url, type, function(error, data) {
		that.updateData(data,graph);
	    }); 
	}else if (ext == 'json'){
	    d3.json(url, type, function(error, data) {
		that.updateData(data,graph);
	    });	    
	}
    },
    updateData: function(data,graph){
	if(graph.chart) graph.chart.remove();
	
	graph.chart = graph.svg.append('g')
	    .attr('transform', utils.translation(graph.margin.left,graph.margin.top));
	
	graph.x.domain(data.map(function(d) { return d.name; }));
	graph.y.domain([0, d3.max(data, function(d) { return d.value; })]);
	
	graph.chart.append('g')
	    .attr('class', 'x axis')
	    .attr('transform', utils.translation(0,graph.height))
	    .call(graph.xAxis);
	
	graph.chart.append('g')
	    .attr('class', 'y axis')
	    .call(graph.yAxis);
	
	graph.chart.selectAll('.bar')
	    .data(data)
	    .enter().append('rect')
	    .attr('class', 'bar')
	    .attr('x', function(d) { return graph.x(d.name); })
	    .attr('y', function(d) { return graph.y(d.value); })
	    .attr('height', function(d) { return graph.height - graph.y(d.value); })
	    .attr('width', graph.x.rangeBand());
    },
    generate: function(id){
	var width = utils.widthCalc(id);
	var height = utils.heightCalc(id);
	var margin = {top: (0.04*height), right: (0.03125*width), bottom: (0.06*height), left: (0.04166*width)};
	
	var graph = {
	    margin: margin,
	    width: width - margin.left - margin.right,
	    height: height - margin.top - margin.bottom,
	};
	
	graph.x = d3.scale.ordinal().rangeRoundBands([0, graph.width], .1);
	graph.y = d3.scale.linear().range([graph.height, 0]);
	graph.xAxis = d3.svg.axis().scale(graph.x).orient('bottom');
	graph.yAxis = d3.svg.axis().scale(graph.y).orient('left');
	
	graph.svg = d3.select('#'+id).append('svg').attr('width', width).attr('height', height);

	return graph;
    }
}

var oas;
var dummy = [{'name':'A','value':Math.random()*10},
	     {'name':'B','value':Math.random()*10},
	     {'name':'C','value':Math.random()*10},
	     {'name':'D','value':Math.random()*10},
	     {'name':'E','value':Math.random()*10},
	     {'name':'F','value':Math.random()*10},
	     {'name':'G','value':Math.random()*10}]
document.addEventListener('DOMContentLoaded', function(event) {
    // Create graph
    oas = barras.generate('chart');
    // Load from file
    barras.loadDataFromFile('data/data.tsv',oas);
    setTimeout(function(){
	// Load from data array
	barras.updateData(dummy,oas);
    }, 3000);
})
