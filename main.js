//initilising mapView variable 
var mapView=new ol.View({
    center: [0,0],
    zoom :5,

});

//map initialisation
var map = new ol.Map({
    target: 'map',
    view: mapView,
    });

//add OSM layer
var osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
    title: "OpenStreetMap"
});
map.addLayer(osmLayer);

//adding counties  layer from geoserver
var CountiesLayer = new ol.layer.Tile({
    title: "Counties",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/Bapp_2023/wms',
          //SPECIFYING PARAMETERS
        params: {'LAYERS': 'Bapp_2023:counties', 'TILED': true},
        serverType: 'geoserver',
        
        
    })
});
map.addLayer(CountiesLayer);

//adding roads layer
var geoServerLayer = new ol.layer.Tile({
    title:"KRBRoads",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/Bapp_2023/wms',
        params: {'LAYERS': 'Bapp_2023:KRBRoads', 'TILED': true},
        serverType: 'geoserver'
    })
});
map.addLayer(geoServerLayer);

//adding protected areas layer
var protectedareasLayer = new ol.layer.Tile({
    title:"protected areas",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/Bapp_2023/wms',
        params: {'LAYERS': 'Bapp_2023:protectedareas', 'TILED': true},
        serverType: 'geoserver'
    })
})
map.addLayer(protectedareasLayer)

//adding parks layer
var parksLayer = new ol.layer.Tile({
    title:"parks",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/Bapp_2023/wms',
        params: {'LAYERS': 'Bapp_2023:parks', 'TILED': true},
        serverType: 'geoserver'
    })
});
map.addLayer(parksLayer);

//adding primary schools layer
var primarySchoolsLayer=new ol.layer.Tile({
    title:"primary schools",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/Bapp_2023/wms',
        params: {'LAYERS': 'Bapp_2023:primary_schools', 'TILED': true},
        serverType: 'geoserver'
       
    })
});
map.addLayer(primarySchoolsLayer);

//adding layer switcher

var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: false,
    groupSelectStyle: 'none'
});

map.addControl(layerSwitcher);

// adding popup elements
var container=document.getElementById("popup");
var content=document.getElementById("popup_content");
var closer=document.getElementById("popup_closer");

//creating popup overlay
var popup= new ol.Overlay({
    element:container,
    autoPan:true,
    autoPanAnimation: {
        duration:200,
    },

});
map.addOverlay(popup);

closer.onclick=function(){
    popup.setPosition(undefined);
    closer.blur();
    return false;
};

//initialising click

map.on('singleclick',function(e){
    content.innerHTML="";
    var resolution= mapView.getResolution();
//providing url for feature details
    var url=parksLayer.getSource().getFeatureInfoUrl(e.coordinate,resolution,'EPSG:4326',{
        "INFO_FORMAT":'application/json',
        "propertyName":"parkname",
    });
    
    if (url){
    $.getJSON(url,function (data){
        var feature = data.features[0];
        var props= feature.properties;
        content.innerHTML="<h3> parkname :</h3>" + props.state.toUpperCase();
        popup.setPosition(evt.coordinate);
    })
}    else{ 
    popup.setPosition(undefined);
}
});






       


