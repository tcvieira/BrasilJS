

$(window).load(function(){
	
	$.ajaxSetup ({  
    cache: false  
	}); 
	
	var restUrl = "urlHERE";
	var dados = {};
	
	
	$.ajax({
	  type: "GET",
	  url: restUrl,
	  dataType: "jsonp",
	  error: function(xhr, status, error) {
		alert('Erro ao carregar os dados dos projetos');
	  },
	  success: function(json){
		dados = json;
	  }
	});

		
    for (var i=0; i < estadosBrasil.features.length; i++){
		estadosBrasil.features[i].properties.projetos = dados[estadosBrasil.features[i].properties.nome];
	}
	
	var geojson;

	function getColor(d) {
		return d > 1000 ? '#99000D' :
			   d > 500  ? '#CB181D' :
			   d > 200  ? '#EF3B2C' :
			   d > 100  ? '#FB6A4A' :
			   d > 50   ? '#FC9272' :
			   d > 20   ? '#FCBBA1' :
			   d > 10   ? '#FEE0D2' :
						  '#FFF5F0';
	}

	function style(feature) {
		return {
			fillColor: getColor(feature.properties.projetos),
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7
		};
	}
	
	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent(e.latlng.toString())
			.openOn(map);
	}
	
	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 2,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.8
		});

		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature 
		});
	}
	
	var map = L.map('map', {
    center: [-15.70,-53.34],
    zoom: 4,
	minZoom: 4,
	});

	map.setMaxBounds([
		[-41.57436, -82.96875],
		[12.72608, -27.94922]
	]);

	L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
		key: 'fdbd507db81a42ca9a70f4ae214eff7f',
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
		maxZoom: 18,
		styleId: '22677', //'997',
		opacity: 0
	}).addTo(map);

	geojson = L.geoJson(estadosBrasil, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);

	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); 
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info.update = function (props) {
		this._div.innerHTML = '<h4>Projetos Cadastrados</h4>' +  (props ?
			'<b>' + props.nome + '</b><br />' + props.projetos + ' projetos'
			: 'Passe o mouse sobre o estado');
	};

	info.addTo(map);

	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 10, 20, 50, 100, 200, 500, 1000],
			labels = [];

		// loop through our density intervals and generate a label with a colored square for each interval
		for (var i = 0; i < grades.length; i++) {
			div.innerHTML +=
				'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}

		return div;
	};

	legend.addTo(map);
	
});


