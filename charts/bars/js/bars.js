(function(){
    window.utils = {
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

    window.barras = {
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
	    graph.data = data;
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
	getChartDimensions: function(graph){
	    if (!graph.id) throw "Graph requires an ID"; 
	    
	    var width = utils.widthCalc(graph.id);
	    var height = utils.heightCalc(graph.id);
	    var margin = {top: (0.04*height), right: (0.03125*width), bottom: (0.06*height), left: (0.04166*width)};
	    
	    graph.margin= margin;
	    graph.width= width - margin.left - margin.right;
	    graph.height= height - margin.top - margin.bottom;
	    
	    graph.x = d3.scale.ordinal().rangeRoundBands([0, graph.width], .1);
	    graph.y = d3.scale.linear().range([graph.height, 0]);
	    graph.xAxis = d3.svg.axis().scale(graph.x).orient('bottom');
	    graph.yAxis = d3.svg.axis().scale(graph.y).orient('left');

	    if(graph.svg) d3.select('#'+graph.id).select('svg').remove();
	    graph.svg = d3.select('#'+graph.id).append('svg').attr('width', width).attr('height', height);
	},
	onResize: function(graph){
	    this.getChartDimensions(graph);
	    this.updateData(graph.data,graph);
	},
	generate: function(id){
	    var that = this;
	    var graph = {id:id};
	    this.getChartDimensions(graph);
	    window.onresize = function(){that.onResize(graph);}
	    return graph;
	}
    }
})();
