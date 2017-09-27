var oas;
document.addEventListener('DOMContentLoaded', function(event) {
    var graph = scatter_plot.generate('chart');
    oas = graph;

    scatter_plot.loadFromFile('data/data.csv',graph);
})
