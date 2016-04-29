var mapColors = {
    total_bosNat:{start:"white",end:"green"},
    total_agro:{start:"#FAFAD2",end:"#DAA520"},
    total_noAgro:{start:"lightred",end:"red"},
    total_otros:{start:"lightcoral",end:"coral"},
    total_pastos:{start:"lightblue",end:"blue"},
    total_rastrojo:{start:"lightpurple",end:"purple"},
    total_agri:{start:"lightbeige",end:"beige"},
    total_infra:{start:"lightcyan",end:"cyan"},
    total_cultivo:{start:"lightsalmon",end:"salmon"},
    total_barbecho:{start:"lightpink",end:"pink"},
    total_descanso:{start:"lightseagreen",end:"seagreen"}
}
var mapcnf = {
    url: 'assets/ColombiaMap.svg',
    id: 'svg-map',
    codPrefix: 'divi-',
    margin: {top: 20, right: 40, bottom: 10, left: 100},
    width: 450,
    height: function(){return 600 - this.margin.top - this.margin.bottom},
    map: undefined,
    mapScale: undefined
}

$(document).ready(function(){
    // Load map
    d3.xml(mapcnf.url, "image/svg+xml", function(error, xml) {
	if (error) throw error;
	document.getElementById(mapcnf.id).appendChild(xml.documentElement);
	mapcnf.map = d3.select('#'+mapcnf.id).selectAll('svg');
	mapcnf.map.attr('width',mapcnf.width).attr('height',mapcnf.height());
	mapcnf.map.selectAll('path').on('click',function (){mapClick(this)});
    });
});

function mapClick(elem){
    console.log("Click on ",elem.id)
    mapcnf.map.selectAll('path').classed('selected',false);
    mapcnf.map.select('#'+elem.id).classed('selected',true);
}

function redrawMap(data){
    mapcnf.map.selectAll('path').classed('selected',false);
    mapcnf.map.selectAll('path').style('fill','grey');
}
