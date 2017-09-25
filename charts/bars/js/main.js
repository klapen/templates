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
