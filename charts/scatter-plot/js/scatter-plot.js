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
    };

    window.scatter_plot = {
	loadFromFile:function(url,graph){
	    function type(d){
		d.day = +d.day;
		d.radius = +d.radius;
		d.value = +d.value;
		return d
	    };

	    var that = this;
	    
	    var ext = url.split('.')[1];
	    if (ext == 'tsv'){
		d3.tsv(url, type, function(error, data) {
		    if (error) throw error;
		    that.updateData(data,graph);
		});
	    }else if(ext == 'csv'){
		d3.csv(url, type, function(error, data) {
		    if (error) throw error;
		    that.updateData(data,graph);
		}); 
	    }else if (ext == 'json'){
		d3.json(url, type, function(error, data) {
		    if (error) throw error;
		    that.updateData(data,graph);
		});	    
	    }
	},
	updateData:function(data,graph){
	    graph.data = data;
	    graph.chart = graph.svg.append("g").attr("transform", "translate(" + graph.margin.left + "," + graph.margin.top + ")");
	    var zoomBeh = d3.behavior.zoom()
		.x(graph.x).y(graph.y)
		.scaleExtent([0, 500])
		.on("zoom", function(){
		    scatter_plot.zoom(graph);
		});
	    graph.chart.call(zoomBeh);
	    
	    graph.x.domain([0,10+d3.max(data, function(d) { return d.day; })]);
	    graph.y.domain([0,5+d3.max(data, function(d) { return d.value; })]);
	    
	    graph.chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + graph.height + ")")
		.call(graph.xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", graph.width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Días");
	    
	    graph.chart.append("g")
		.attr("class", "y axis")
		.call(graph.yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Municipios")
	    
	    graph.chart.selectAll(".dot")
		.data(data)
		.enter().append("circle")
		.attr("class", "dot")
		.attr("r", function(d){return d.radius})
		.attr("cx", function(d) { return graph.x(d.day); })
		.attr("cy", function(d) { return graph.y(d.value); })
		.style("fill", function(d) { return graph.color(d.phase); });
	    
	    graph.legend = graph.chart.selectAll(".legend")
		.data(graph.color.domain())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
	    
	    graph.legend.append("rect")
		.attr("x", graph.width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", graph.color);

	    graph.legend.append("text")
		.attr("x", graph.width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
	},
	getChartDimensions: function(graph){
	    if (!graph.id) throw "Graph requires an ID"; 
	    
	    var width = utils.widthCalc(graph.id);
	    var height = utils.heightCalc(graph.id);
	    var margin = {top: (0.04*height), right: (0.03125*width), bottom: (0.06*height), left: (0.04166*width)};
	    
	    graph.margin= margin;
	    graph.width= width - margin.left - margin.right;
	    graph.height= height - margin.top - margin.bottom;

	    graph.x = d3.scale.linear().range([0, graph.width]);
	    graph.y = d3.scale.linear().range([graph.height, 0]);
	    graph.color = d3.scale.category10();

	    graph.xAxis = d3.svg.axis().scale(graph.x).orient('bottom');
	    graph.yAxis = d3.svg.axis().scale(graph.y).orient('left');
	    
	    if(graph.svg) d3.select('#'+graph.id).select('svg').remove();
	    graph.svg = d3.select('#'+graph.id).append('svg').attr('width', width).attr('height', height);
	},
	onResize: function(graph){
	    this.getChartDimensions(graph);
	    this.updateData(graph.data,graph);
	},
	zoom: function(graph) {
	    console.log('oas');
	    var chart = graph.svg;
	    var t = chart.transition().duration(750);
	    chart.select("#axis--x").transition(t).call(graph.xAxis);
	    chart.select("#axis--y").transition(t).call(graph.yAxis);
	    chart.selectAll(".dot").transition(t)
		.attr("cx", function (d) { return graph.x(d.day); })
		.attr("cy", function (d) { return graph.y(d.value); });
	},
	generate: function(id){
	    var that = this;
	    var graph = {id:id};
	    this.getChartDimensions(graph);
	    window.onresize = function(){that.onResize(graph);}
	    return graph;
	}
    };
})();
