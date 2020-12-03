/* global config, ol */
$(function () {
	$('#map').empty(); // Remove Javascript required message
	var baseLayerIndex = 0;

	//Object to manage the spinner layer
	var loading = {
		init: function () {
			this.count = 0;
			this.spinner = $('<div>').addClass('ol-control osmcat-loading').html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>');
			$('#map').append(this.spinner);
		},
		show: function () {
			this.spinner.show();
			++this.count;
		},
		hide: function () {
			--this.count;
			if (this.count < 1) {
				this.spinner.hide();
				this.count = 0;
			}
		}
	};
	loading.init();

	var overlaysTemp = {};
	$.each(config.overlays, function (index, overlay) {
		var layerGroup = overlay['group'],
				vectorProperties = overlay,
				vector;

		if (overlay['geojson'] !== undefined) {
      var vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: overlay['geojson']
      })
    } else {
			var vectorSource = new ol.source.Vector({ 
			format: new ol.format.OSMXML2(),
			loader: function (extent, resolution, projection) {
				loading.show();
				var me = this;
				var epsg4326Extent = ol.proj.transformExtent(extent, projection, 'EPSG:4326');
				var query = '[maxsize:536870912];' + overlay['query']; // Memory limit 512 MiB
				//var query = layerQuery;
				query = query.replace(/{{bbox}}/g, epsg4326Extent[1] + ',' + epsg4326Extent[0] + ',' + epsg4326Extent[3] + ',' + epsg4326Extent[2]);

				var client = new XMLHttpRequest();
				client.open('POST', config.overpassApi());
				client.onloadend = function () {
					loading.hide();
				};
				client.onerror = function () {
					console.error('[' + client.status + '] Error loading data.');
					me.removeLoadedExtent(extent);
					vector.setVisible(false);
				};
				client.onload = function () {
					if (client.status === 200) {
						var xmlDoc = $.parseXML(client.responseText),
								xml = $(xmlDoc),
								remark = xml.find('remark'),
								nodosLength = xml.find('node').length;

						if (remark.length !== 0) {
							console.error('Error:', remark.text());
							$('<div>').html(remark.text()).dialog({
								modal: true,
								title: 'Error',
								close: function () {
									$(this).dialog('destroy');
								}
							});
							client.onerror.call(this);
						} else {
							console.log('Nodes Found:', nodosLength);
							if (nodosLength === 0) {
								$('<div>').html(config.i18n.noNodesFound).dialog({
									modal: true,
									//title: 'Error',
									close: function () {
										$(this).dialog('destroy');
									}
								});
							}
							var features = new ol.format.OSMXML2().readFeatures(xmlDoc, {
								featureProjection: map.getView().getProjection()
							});
							me.addFeatures(features);
						}
					} else {
						client.onerror.call(this);
					}
				};
				client.send(query);
			},
			strategy: ol.loadingstrategy.bbox
		});
	}
		vectorProperties['source'] = vectorSource;
		vectorProperties['visible'] = false;

		vector = new ol.layer.Vector(vectorProperties);

		if (overlaysTemp[layerGroup] !== undefined) {
			overlaysTemp[layerGroup].push(vector);
		} else {
			overlaysTemp[layerGroup] = [vector];
		}
	});

	$.each(overlaysTemp, function (index, value) {
		var layerGroup = new ol.layer.Group({
			title: index,
			type: 'overlay',
			layers: value
		});
		config.layers.push(layerGroup);
	});

	var round = function (value, decimals) {
	  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
	};
	//Permalink
	var vars = {},
		getUrlParam = function(param, defaultValue) {
			var r = vars[param];
			if (typeof r === 'undefined') {
				r = defaultValue;
			}
			return r;
		};

	if (window.location.hash !== '') {
		window.location.hash.replace(/[#?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
			vars[key] = value;
		});

		// map = zoom, center (lon, lat), [rotation]
		var mapParam = getUrlParam('map', ''), parts;
		if (mapParam !== '') {
			parts = mapParam.split('/');
			config.initialConfig.zoom = parseFloat(parts[0]);
			config.initialConfig.lat = parseFloat(parts[1]);
			config.initialConfig.lon = parseFloat(parts[2]);
			if (typeof parts[3] !== 'undefined') {
				config.initialConfig.rotation = parseFloat(parts[3]);
			}
		}

		// base = index
		var baseParam = parseInt(getUrlParam('base', 0), 10);
		$.each(config.layers, function(indexLayer, layer) {
			if (layer.get('type') === 'overlay') {
				// overlays
				var overlayParam = getUrlParam(layer.get('title'), '');
				$.each(layer.getLayers().getArray(), function (overlayIndex, overlayValue) {
					overlayValue.setVisible(!!parseInt(overlayParam.charAt(overlayIndex)));
				});
			} else {
				// overlays
				if (indexLayer === baseParam) {
					layer.setVisible(true);
				} else {
					layer.setVisible(false);
				}
			}
		});

	}

	var view = new ol.View({
		center: ol.proj.fromLonLat([config.initialConfig.lon, config.initialConfig.lat]), // Transform coordinate from EPSG:3857 to EPSG:4326
		rotation: config.initialConfig.rotation,
		zoom: config.initialConfig.zoom
	});

	const map = new ol.Map({
		layers: config.layers,
		target: 'map',
		view: view
	});

	var layersControlBuild = function () {
		var visibleLayer,
			previousLayer,
			layerIndex = 0,
			overlayIndex = 0,
			container = $('<div>').addClass('osmcat-menu'),
			layerDiv = $('<div>').addClass('osmcat-layer'),
			overlaySelect = $('<select>').addClass('osmcat-select').on('change', function () {
				var overlaySelected = $(this).find('option:selected');

				container.find('.osmcat-overlay').hide();
				container.find('.' + overlaySelected.val()).show();
			}),
			overlayDiv = $('<div>').hide().addClass('osmcat-layer').append($('<div>').append(overlaySelect)),
			label = $('<div>').html('<b>&equiv; ' + config.i18n.layersLabel + '</b>').on('click', function () {
				content.toggle();
			}),
			content = $('<div>').addClass('osmcat-content');

		config.layers.forEach(layer => {
			if (layer.get('type') === 'overlay') {
				var title = layer.get('title'),
					layerButton = $('<h3>').html(title),
					overlayDivContent = $('<div>').addClass('osmcat-content osmcat-overlay overlay' + overlayIndex);

				overlaySelect.append($('<option>').val('overlay' + overlayIndex).text(title));

				layer.getLayers().forEach(overlay => {
					var overlaySrc = overlay.get('iconSrc'),
						overlayIconStyle = overlay.get('iconStyle') || '',
						title = (overlaySrc ? '<img src="' + overlaySrc + '" height="16" style="' + overlayIconStyle + '"/> ' : '') + overlay.get('title'),
						overlayButton = $('<div>').html(title).on('click', function () {
							var visible = overlay.getVisible();
							overlay.setVisible(!visible);
							updatePermalink();
						});
					overlayDivContent.append(overlayButton);
					if (overlay.getVisible()) {
						overlayButton.addClass('active');
					}
					overlay.on('change:visible', function () {
						if (overlay.getVisible()) {
							overlayButton.addClass('active');
						} else {
							overlayButton.removeClass('active');
						}
					});
				});

				overlayDiv.append(overlayDivContent);
				overlayDiv.show();
				overlayIndex++;
			} else {
				var layerSrc = layer.get('iconSrc'),
					title = (layerSrc ? '<img src="' + layerSrc + '" height="16"/> ' : '') + layer.get('title'),
					layerButton = $('<div>').html(title).on('click', function () {
						var visible = layer.getVisible();

						if (visible) { //Show the previous layer
							if (previousLayer) {
								baseLayerIndex = previousLayer.get('layerIndex');
								layer.setVisible(!visible);
								previousLayer.setVisible(visible);
								visibleLayer = previousLayer;
								previousLayer = layer;
							}
						} else { //Active the selected layer and hide the current layer
							baseLayerIndex = layer.get('layerIndex');
							layer.setVisible(!visible);
							visibleLayer.setVisible(visible);
							previousLayer = visibleLayer;
							visibleLayer = layer;
						}
						updatePermalink();
					});

					layer.set('layerIndex', layerIndex);

				content.append(layerButton);
				if (layer.getVisible()) {
					if (visibleLayer === undefined) {
						layerButton.addClass('active');
						visibleLayer = layer;
						baseLayerIndex = layerIndex;
					} else {
						layer.setVisible(false);
					}
				}
				layer.on('change:visible', function () {
					if (layer.getVisible()) {
						layerButton.addClass('active');
					} else {
						layerButton.removeClass('active');
					}
				});
				layerIndex++;
			}
		});
		layerDiv.append(label, content);
		container.append(layerDiv, overlayDiv);
		overlaySelect.trigger('change');

		return container;
	};

	$('#menu').append(layersControlBuild());

	map.addControl(new ol.control.MousePosition({
		coordinateFormat: function (coordinate) {
			return ol.coordinate.format(coordinate, '[{y}, {x}]', 5);
		},
		projection: 'EPSG:4326'
	}));
	map.addControl(new ol.control.ScaleLine({units: config.initialConfig.units}));
	map.addControl(new ol.control.ZoomSlider());

	// Geolocation Control
	// In some browsers, this feature is available only in secure contexts (HTTPS)
	var geolocationControlBuild = function () {
		var container = $('<div>').addClass('ol-control ol-unselectable osmcat-geobutton').html($('<button type="button"><i class="fa fa-bullseye"></i></button>').on('click', function () {
			if (navigator.geolocation) {
				if (location.protocol !== 'https') {
					console.warn('In some browsers, this feature is available only in secure context (HTTPS)');
				}
				navigator.geolocation.getCurrentPosition(function (position) {
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;

					view.animate({
						zoom: config.initialConfig.zoomGeolocation,
						center: ol.proj.fromLonLat([longitude, latitude])
					});
				}, function (error) {
					console.error(error.message, error);
					alert(error.message);
				});
			} else {
				console.error('Geolocation is not supported by your browser');
			}
		}));
		return container[0];
	};
	map.addControl(new ol.control.Control({
		element: geolocationControlBuild()
	}));

	// Info Control
	var infoControlBuild = function () {
		var container = $('<div>').addClass('ol-control ol-unselectable osmcat-infobutton').html($('<button type="button"><i class="fa fa-info-circle"></i></button>').on('click', function () {
			window.location.href = 'https://github.com/yopaseopor/osmhistoricmap';
		}));
		return container[0];
	};
	map.addControl(new ol.control.Control({
		element: infoControlBuild()
	}));

	// Copy permalink button
	var permalinkControlBuild = function () {
		var container = $('<div>').addClass('ol-control ol-unselectable osmcat-sharebutton').html($('<button type="button"><i class="fa fa-share-alt-square"></i></button>').on('click', function () {
			var dummyInput = $('<input>').val(window.location.href),
				successful = false;

			$('body').append(dummyInput);
			dummyInput.focus();
			dummyInput.select();
			successful = document.execCommand('copy');
			dummyInput.remove();
			if (successful) {
				var modalDialogTimeout,
					modalDialog = $('<div>').html(config.i18n.copyDialog).dialog({
					modal: true,
					resizable: false,
					close: function () {
						clearTimeout(modalDialogTimeout);
						$(this).dialog('destroy');
					}
				});
				modalDialogTimeout = setTimeout(function(){
					modalDialog.dialog('destroy');
				}, 3000);
			}
		}));
		return container[0];
	};
	map.addControl(new ol.control.Control({
		element: permalinkControlBuild()
	}));

	// Rotate left button
	var rotateleftControlBuild = function () {
		var container = $('<div>').addClass('ol-control ol-unselectable osmcat-rotateleft').html($('<button type="button"><i class="fa fa-undo"></i></button>').on('click', function () {
			var currentRotation = view.getRotation();
			if (currentRotation > -6.1) { //360º = 2 Pi r =aprox 6.2
				view.setRotation(round(currentRotation - 0.1, 2));
			} else {
				view.setRotation(0);
			}
		}));
		return container[0];
	};
	map.addControl(new ol.control.Control({
		element: rotateleftControlBuild()
	}));

	// Rotate right button
	var rotaterightControlBuild = function () {
		var container = $('<div>').addClass('ol-control ol-unselectable osmcat-rotateright').html($('<button type="button"><i class="fa fa-repeat"></i></button>').on('click', function () {
			var currentRotation = view.getRotation();
			if (currentRotation < 6.1) { //360º = 2 Pi r =aprox 6.2
				view.setRotation(round(currentRotation + 0.1, 2));
			} else {
				view.setRotation(0);
			}
		}));
		return container[0];
	};
	map.addControl(new ol.control.Control({
		element: rotaterightControlBuild()
	}));

	$('#map').css('cursor', 'grab');
	map.on('movestart', function (evt) {
		$('#map').css('cursor', 'grabbing');
	});

	var shouldUpdate = true;
	// restore the view state when navigating through the history, see
	// https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
	window.addEventListener('popstate', function(event) {
		if (event.state === null) {
			return;
		}
		map.getView().setCenter(ol.proj.fromLonLat(event.state.center));
		map.getView().setZoom(event.state.zoom);
		map.getView().setRotation(event.state.rotation);

		$.each(config.layers, function(indexLayer, layer) {
			if (layer.get('type') === 'overlay') {
				// overlays
				var overlayParam = event.state.overlay[layer.get('title')];
				if (typeof overlayParam === 'undefined') {
					overlayParam = '';
				}
				$.each(layer.getLayers().getArray(), function (overlayIndex, overlayValue) {
					overlayValue.setVisible(!!parseInt(overlayParam.charAt(overlayIndex)));
				});
			} else {
				// overlays
				if (indexLayer === event.state.baseLayer) {
					layer.setVisible(true);
				} else {
					layer.setVisible(false);
				}
			}
		});

		shouldUpdate = false;
	});

	var updatePermalink = function() {
		if (!shouldUpdate) {
			// do not update the URL when the view was changed in the 'popstate' handler
			shouldUpdate = true;
			return;
		}

		var zoom = round(view.getZoom(), 3),
			center = ol.proj.toLonLat(view.getCenter()),
			rotation = round(view.getRotation(), 2),
			overlayState = {};

		var hash = '#map=' + zoom + '/' + round(center[1], 5) + '/' + round(center[0], 5) + '/' + rotation;
		if (baseLayerIndex !== 0) {
			hash += '&base=' + baseLayerIndex;
		}

		$.each(config.layers, function(indexLayer, layer) {
			var hashOverlay = '', addHash = false;
			if (layer.get('type') === 'overlay') {
				// overlays
				$.each(layer.getLayers().getArray(), function (overlayIndex, overlayValue) {
					if (overlayValue.getVisible()) {
						hashOverlay += '1';
						addHash = true;
					} else {
						hashOverlay += '0';
					}
				});
				if (addHash) {
					hash += '&' + layer.get('title') + '=' + hashOverlay;
				}
				overlayState[layer.get('title')] = hashOverlay;
			}
		});

		var state = {
			zoom: zoom,
			center: center,
			rotation: rotation,
			baseLayer: baseLayerIndex,
			overlay: overlayState
		};

		window.history.pushState(state, 'map', hash);
	};

	map.on('moveend', function (evt) {
		$('#map').css('cursor', 'grab');
		updatePermalink();
	});

	var selectedFeature = null;
	map.on('pointermove', function (evt) {
		if (selectedFeature !== null) {
			selectedFeature.setStyle(undefined);
			selectedFeature = null;
			$('#map').css('cursor', 'grab');
		}
		map.forEachFeatureAtPixel(evt.pixel, function (feature) {
			selectedFeature = feature;
			$('#map').css('cursor', 'pointer');
			return true;
		});
	});

	map.on('singleclick', function (evt) {
		var coordinate = evt.coordinate,
				coordinateLL = ol.proj.toLonLat(coordinate),
				coordinateText = ol.coordinate.format(coordinateLL, '[{y}, {x}]', 5);
		console.log('pinMap', coordinateText);
		var pinMap = new ol.Overlay({
			element: $('<div>').addClass('osmcat-map-pin').attr('title', coordinateText).html('<i class="fa fa-map-pin"></i>')[0],
			position: coordinate
			//positioning: 'bottom-center' //BUG center no funciona correctament en la v6.1.1 -> FIX setPositioning
		});
		map.addOverlay(pinMap);
		pinMap.setPositioning('bottom-center'); //FIX bug al centrar l'element

		var popupContingut = config.onClickEvent.call(this, evt, view, coordinateLL);

		var nodeInfo = $('<div>');
		var numFeatures = 0;
		map.forEachFeatureAtPixel(evt.pixel, function (feature) {
			numFeatures++;
			nodeInfo.append(config.forFeatureAtPixel.call(this, evt, feature));
		});

		var popupContingutExtra = config.onClickEventExtra.call(this, evt, view, coordinateLL, numFeatures);

		$('<div>').html([popupContingut, nodeInfo, popupContingutExtra]).dialog({
			title: coordinateText,
			position: {my: 'left top', at: 'left bottom', of: $(pinMap.getElement())},
			close: function () {
				$(this).dialog('destroy');
				map.removeOverlay(pinMap);
			},
			focus: function () {
				$(pinMap.getElement()).animate({color: '#F00', paddingBottom: 5}, 200).animate({color: '#000', paddingBottom: 0}, 200).animate({color: '#F00', paddingBottom: 5}, 200).animate({color: '#000', paddingBottom: 0}, 200).animate({color: '#F00', paddingBottom: 5}, 200).animate({color: '#000', paddingBottom: 0}, 200);
			}
		});

	});
});

function linearColorInterpolation(colorFrom, colorTo, weight) {
	var p = weight < 0 ? 0 : (weight > 1 ? 1 : weight),
		w = p * 2 - 1,
		w1 = (w/1+1) / 2,
		w2 = 1 - w1,
		rgb = [Math.round(colorTo[0] * w1 + colorFrom[0] * w2), Math.round(colorTo[1] * w1 + colorFrom[1] * w2), Math.round(colorTo[2] * w1 + colorFrom[2] * w2)];
	return rgb;
}
