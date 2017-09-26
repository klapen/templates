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

    window.group_bars = {
	getChartDimensions: function(graph){
	    if (!graph.id) throw "Graph requires an ID";
	    if (!graph.data) throw "Graph requires data"; 
	    
	    var width = utils.widthCalc(graph.id);
	    var height = utils.heightCalc(graph.id);
	    var margin = {top: (0.04*height), right: (0.03125*width), bottom: (0.06*height), left: (0.04166*width)};
	    
	    graph.margin= margin;
	    graph.width= width - margin.left - margin.right;
	    graph.height= height - margin.top - margin.bottom;

	    var bars = graph.data.length;
	    var groups = graph.data[0].length;
	    
	    graph.y = d3.scale.linear().domain([0, 1]).range([graph.height, 0]);
	    graph.x0 = d3.scale.ordinal().domain(d3.range(groups)).rangeBands([0, graph.width], .2);
	    graph.x1 = d3.scale.ordinal().domain(d3.range(bars)).rangeBands([0, graph.x0.rangeBand()]);
	    graph.z = d3.scale.category10();

	    graph.xAxis = d3.svg.axis().scale(graph.x0).orient('bottom');
	    graph.yAxis = d3.svg.axis().scale(graph.y).orient('left');
	    
	    if(graph.svg) d3.select('#'+graph.id).select('svg').remove();
	    graph.svg = d3.select('#'+graph.id).append('svg');
	    
	    graph.svg.attr('width', graph.width + graph.margin.left + graph.margin.right)
		.attr('height', graph.height + graph.margin.top + graph.margin.bottom)

	},
	onResize: function(graph){
	    this.getChartDimensions(graph);
	    this.updateData(graph.data,graph);
	},
	loadData: function(graph){
	    var n = 6, // number of samples
		m = 4; // number of series
	    
	    graph.data = d3.range(m).map(function() { return d3.range(n).map(Math.random);});
	},
	updateData: function(data,graph){
	    graph.data = data;
	    if(graph.chart) graph.chart.remove()
	    
	    graph.chart = graph.svg.append('g')
		.attr('transform', utils.translation(graph.margin.left,graph.margin.top));

	    
	    graph.chart.append("g")
		.attr("class", "y axis")
		.call(graph.yAxis);

	    graph.chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + graph.height + ")")
		.call(graph.xAxis);

	    graph.chart.append("g").selectAll("g")
		.data(graph.data)
		.enter().append("g")
		.style("fill", function(d, i) { return graph.z(i); })
		.attr("transform", function(d, i) { return "translate(" + graph.x1(i) + ",0)"; })
		.selectAll("rect")
		.data(function(d) { return d; })
		.enter().append("rect")
		.attr("width", graph.x1.rangeBand())
		.attr("height", graph.y)
		.attr("x", function(d, i) { return graph.x0(i); })
		.attr("y", function(d) { return graph.height - graph.y(d); });
	},
	generate: function(id){
	    var that = this;
	    var graph = {id:id};
	    
	    this.loadData(graph);
	    this.getChartDimensions(graph);
	    this.updateData(graph.data,graph);
	    
	    window.onresize = function(){that.onResize(graph);}
	    return graph;
	}
    }
})();
