// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "ApTJzdkyN1DdFKkRAE6QIDtzihNaf6IWJsT-nQ_2eMoO4PN__0Tzhl2-WgJtXFSp";

var map = new OpenLayers.Map( 'map');

var road = new OpenLayers.Layer.Bing({
    key: apiKey,
    type: "Road",
    // custom metadata parameter to request the new map style - only useful
    // before May 1st, 2011
    metadataParams: {mapVersion: "v1"}
});
var aerial = new OpenLayers.Layer.Bing({
    key: apiKey,
    type: "Aerial"
});
var hybrid = new OpenLayers.Layer.Bing({
    key: apiKey,
    type: "AerialWithLabels",
    name: "Bing Aerial With Labels"
});

map.addLayers([road, aerial, hybrid]);
map.addControl(new OpenLayers.Control.LayerSwitcher());
// Zoom level numbering depends on metadata from Bing, which is not yet loaded.
var zoom = map.getZoomForResolution(76.43702827453613);
map.setCenter(new OpenLayers.LonLat(-71.147, 42.472).transform(
    new OpenLayers.Projection("EPSG:4326"),
    map.getProjectionObject()
), zoom);
