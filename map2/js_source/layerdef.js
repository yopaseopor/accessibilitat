
// ====================
// bevat de query strings voor de verschillende lagen
//
// formaat make_layer variabelen:
//
//<URL> string 'url',<color>: string '#RGB', <name>: string '[imagetype]tekst', <lijnbreedte>[.cirkelradius]: int/float, <zichtbaarheid> : boolean, [lijntpye][transparantie] :string '[aan uit (aan uit ( ...))][@transparantie]'
//
// imagetype: #l# = lijn, #dl#=dubbele lijn, #d# = stippellijn, #c#= transparant, #co# = cirkel opaque met cijfers
// aan/uit = pixellengte van de lijn, zichtbare lijn-open gedeelte
// transparantie = 0-1 transparantie van de lijn
//
//=====================
// ====================
//	
//	COPIAR	if (type == "nameofthe td id"){                         of index.html
//  COPIAR	map.addLayers([
//	COPIAR  make_layer(QURL + "?data=(way[key=value](bbox);node(w);way[otherkey=othervalue](bbox);node(w););out+skel;", "#colorinRGB",name="#typeofline#nameyouwillseeattheslector",circleradius/width of the line,default active (boolean value),"start end of the line@transparency"),
// COPIAR			]);
// COPIAR			
// COPIAR		}
// INSTRUCCIONS #colorinRGB: RGB color for the line/cercle
// INSTRUCCIONS #typeofline#: #l# = line, #dl#=double line, #d# = uncontinuous line, #c#= transparent, #co# = cercle opaque
// INSTRUCCIONS start/end of the line pixels in which start the line
// INSTRUCCIONS default active option true enabled false unabled
// INSTRUCCIONS transparency = @0-1 transparency of the line
//
//=====================
// ====================
//	
//	COPIAR	if (type == "nombredelaidtd"){                         nombre de la id de la td  de index.html
//  COPIAR	map.addLayers([
//	COPIAR  make_layer(QURL + "?data=(nodovíaorelación[clave=valor](bbox);node(w);otronodovíaorelación[otraclave=otrovalor](bbox);node(w););out+skel;", "#colorenRGB",name="#tipodelínea#elnombrequedeseesparaelselector",radiodelcírculo/anchuradelínea,selectoractivooinactivopordefecto (valor booleano),"inicio final de la línea@transparencia"),
// COPIAR			]);
// COPIAR			
// COPIAR		}
// INSTRUCCIONS #colorenRGB: código RGB del color para la línea/círculo
// INSTRUCCIONS #tipodelínea#: #l# = línea, #dl#=línea doble, #d# = discontinua, #c#= transparente, #co# = círculo opaco
// INSTRUCCIONS inicio/fin de la discontinuidad de la línea
// INSTRUCCIONS selector activado por defecto: true activado false desactivado
// INSTRUCCIONS transparencia = @0-1 transparencia de la línea
//
//=====================
// ====================
//	
//	COPIAR	if (type == "nombredelaidtd"){                         nom de la id de la td  d'index.html
//  COPIAR	map.addLayers([
//	COPIAR  make_layer(QURL + "?data=(nodeviaorelació[clau=valor](bbox);node(w);altreviaonodeorelació[altraclau=altrevalor](bbox);node(w););out+skel;", "#colorenRGB",name="#tipusdelínia#elnomquedesitgispelselector",radidelcercle/ampladadelínia,selectoractiuperdefecte (valor booleà),"inici final de la línia@transpareècia"),
// COPIAR			]);
// COPIAR			
// COPIAR		}
// INSTRUCCIONS #colorenRGB: codi RGB del color per a la línia/cercle
// INSTRUCCIONS #tipusdelínia#: #l# = línia, #dl#=línia doble, #d# = discontínua, #c#= transparent, #co# = cercle opac
// INSTRUCCIONS inici/fi de la discontinuitat de la línia
// INSTRUCCIONS selector activat per defecte: true activat false desactivat
// INSTRUCCIONS transparència = @0-1 transparència de la línia
//
//=====================
function layerdef(type){

	/*
	 * {
	 * 	strokeColor: "red",
	 * 	strokeOpacity: 0.9,
	 * 	strokeWidth: 5,
	 * 	strokeLinecap: "square",
	 * 	strokeDashstyle: "1 0"
	 */
	function defaultSolidLine(color){
		return(
		{
			strokeColor:color,
			strokeOpacity:0.7,
			strokeWidth:2,
			strokeLinecap: "square",
		});
	}

	function defaultDashedLine(color){
		return(
		{
			strokeColor:color,
			strokeOpacity:0.7,
			strokeWidth:2,
			strokeLinecap: "square",
			strokeDashstyle: "6 10"
		});
	}

	if (type == "cycleways"){
		//	dit maakt de layers voor de cycleway tags
		map.addLayers([
		//highway=cycleway
			make_layer(
				QURL + "?data=(way[highway=cycleway](bbox);node(w);way[highway~'path$|^footway$'][bicycle=designated](bbox);node(w););out+skel;",
				name="#l#highway=cycleway",
				defaultSolidLine("red"),
				false,
			),
			//Bromfiets/Fietpaden/Onverpl.fietspaden
            make_layer(
				QURL + "?data=(way[highway=cycleway][moped~'^designated$|^yes$'](bbox);node(w);way[highway=cycleway]['moped:forward'~'^designated$|^yes$'](bbox);node(w);way[highway=cycleway]['moped:backward'~'^designated$|^yes$'](bbox);node(w););out+skel;",
				name="#l#cycleway, moped=yes",
				defaultSolidLine("purple"),
				false
			),
			  
            make_layer(
				QURL + "?data=(way[highway=cycleway][moped=no](bbox);node(w););out+skel;",
				name="#dl#cycleway moped=no",
				defaultDashedLine("cyan"),
				false
			),
			
            make_layer(
				QURL + "?data=(way[highway=cycleway][mofa=no](bbox);node(w););out+skel;", 
				name="#l#cycleway mofa=no",
				defaultSolidLine("cyan"),
				false),
			
/*			  
			// kenmerken met cycleway
			  
			make_layer(QURL + "?data=(way[cycleway=cyclestreet](bbox);node(w);way[bicycle_road=yes](bbox);node(w);way[cyclestreet=yes](bbox);node(w););out+skel;","#ff65d5",name="#l#cyclestreet", 8, false),
			
			make_layer(QURL + "?data=(way[cycleway~'track'][highway!=cycleway](bbox);node(w);way['cycleway:right'~'track'](bbox);node(w);way['cycleway:left'~'track'](bbox);node(w););out+skel;", "#ff6541",name="#l#cycleway=track", 6, false,"@0.9"),
			
         	make_layer(QURL + "?data=(way[cycleway=lane](bbox);node(w);way[cycleway=opposite_lane](bbox);node(w);way['cycleway:right'=opposite_lane](bbox);node(w);way['cycleway:left'=opposite_lane](bbox);node(w);way['cycleway:left'=lane](bbox);node(w););out+skel;","#ff6541",name="#dl#cycleway=lane", 6, false,"6 10@0.9"),

			make_layer(QURL + "?data=(way[cycleway='shared_lane'](bbox);node(w);way[cycleway=share_busway](bbox);node(w);way[cycleway=opposite_share_busway](bbox);node(w);way['cycleway:left'='shared_lane'](bbox);node(w);way['cycleway:right'='shared_lane'](bbox);node(w););out+skel;","red",name="#d#cycleway=shared_lane", 2, false,"6 10"),
          	
		
			//kenmerken met oneway
			make_layer(QURL + "?data=(way[highway~'^unclas|^living|^resid|road|cycleway'][oneway~'yes|true|1|-1'][cycleway!~'.'][bicycle!=no]['bicycle:oneway'!=no]['oneway:bicycle'!=no](bbox);node(w);way['bicycle:oneway'~'yes|true|1|-1'](bbox);node(w);way['oneway:bicycle'~'yes|true|1|-1'](bbox);node(w););out+skel;", "blue",name="#dl#oneway street", 3, false,"6 10"),
			
			
            make_layer(QURL + "?data=(way['oneway:bicycle'=no](bbox);node(w);way[cycleway~'opposite'](bbox);node(w);way['bicycle:oneway'= no](bbox);node(w););out+skel;", "green",name="#dl#cycleway=opposite or<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsponeway:bicyle=no", 3, false,"6 10"),


			  
			make_layer(QURL + "?data=(way[bicycle~'^designated$|^yes$'][highway~'^footway$|^pedestrian$|^path$|^track$|^steps$'](bbox);node(w);way['ramp:bicycle'=yes](bbox);node(w);node[bicycle=yes][barrier!=bollard](bbox););out+skel;", "#39ff20",name="#l#bicycle=yes & footway,<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsppath, track, steps", 5, false),

			//pois
			make_a_layer(QURL + "?data=(node[shop=bicycle](bbox);node[amenity=bicycle_repair_station](bbox);way[shop=bicycle](bbox);node(w););out;", "#0000a0", name="#c#shop=bicycle/repair station", 0.7, false),
			make_layer(QURL + "?data=node[amenity~'bicycle'][amenity!=bicycle_repair_station](bbox);out+skel;(way[amenity~'bicycle'](bbox);node(w););out+skel;", "#39ffd5",name="#c#&nbspbicycle_parking/rental", 4, false),
			make_layer(QURL + "?data=node[barrier=bollard](bbox);out+skel;", "red", name="#c#&nbspbollard", 3, false),			  
			make_layer(QURL + "?data=node[barrier][barrier!=bollard](bbox);out+skel;", "#bd9541", name="#c#&nbspother barrier<hr>", 3, false),
			

			

			// non cyclable ways
			make_layer(QURL + "?data=(way[bicycle=dismount](bbox);node(w);node[bicycle=dismount](bbox);node(w););out+skel;","yellow",name="#dl#bicycle=dismount", 4, false,"6 10"),
			
			make_layer(QURL + "?data=(way[bicycle~'no|use_sidepath'](bbox);node(w);way[highway][access~'^no|^priv'][vehicle!~'yes'][bicycle!~'^no|^yes|^desig|^offic|^destin|^permis'][mtb!~'^yes|^desig|^offic|^destin|^permis']['mtb:scale'!~'^'](bbox);node(w);way[highway~'^foot|^path|^pedes|^platform|^steps|^bridleway|^prop|^constr'][access! ~'^no|^priv'][bicycle!~'^no|^yes|^desig|^offic|^destin|^permis'][mtb!~'^yes|^desig|^offic|^destin|^permis']['ramp:bicycle'!~'yes'](bbox);node(w);way[highway=track][horse=designated][access! ~'^no|^priv'][bicycle!~'^no|^yes|^desig|^offic|^destin|^permis'][mtb!~'^yes|^desig|^offic|^destin|^permis']['mtb:scale'!~'^'][route!=mtb](bbox);node(w););out+skel;", "#393020",name="<img style='vertical-align: middle;background-color:#393020;' src='img/line.gif'> 'non cycleable' ways", 7, false,"@0.5"),

            make_layer(QURL + "?data=(way[bicycle=use_sidepath](bbox);node(w););out+skel;","#bd65d5",name="#dl#bicycle=use_sidepath", 4, false,"6 10"),
			
			make_layer(QURL + "?data=(way[bicycle=no](bbox);node(w););out+skel;","black",name="#dl#bicycle=no", 4, false,"6 10")
*/
		]);
	}

	/*
	 * base Point Parameters:
	 * {
	 * 	strokeColor:"#FFFFFF",
	 * 	strokeOpacity:0.9,
	 * 	strokeWidth:3,
	 * 	pointRadius:3
	 * 	fillColor: "white",
	 * 	fillOpacity: 0.75,
	 * }
	 */
	function defaultPoint(color){
		return (
		{
			strokeColor:color,
			strokeOpacity:0.9,
			strokeWidth:3,
			pointRadius:5,
			fillColor:"white",
			fillOpacity:0.75
		});
	}
	
		function defaultPoint2(color){
		return (
		{
			strokeColor:color,
			strokeOpacity:0.5,
			strokeWidth:3,
			pointRadius:5,
			fillColor:"white",
			fillOpacity:0.5
		});
	}
	
		function defaultPoint3(color){
		return (
		{
			strokeColor:color,
			strokeOpacity:1,
			strokeWidth:3,
			pointRadius:5,
			fillColor:"white",
			fillOpacity:0
		});
	}
	
		function defaultPoint4(color){
		return (
		{
			strokeColor:color,
			strokeOpacity:0.9,
			strokeWidth:3,
			pointRadius:7,
			fillColor:"white",
			fillOpacity:0
		});
	}
	
			function defaultPoint5(color){
		return (
		{
			strokeColor:color,
			strokeOpacity:0.9,
			strokeWidth:3,
			pointRadius:9,
			fillColor:"white",
			fillOpacity:0
		});
	}

	/*
	 * external Point Parameters:
	 * {
	 * 	externalGraphic: "path/to/icon.png",
	 * 	graphicWidth: 6,
	 * 	graphicHeight:6,
	 * 	graphicOpacity: 0.75,
	 * 	graphicXOffset: 0,
	 * 	graphicYOffset: 0,
	 * 	rotation: 0
	 * }
	 */
	function defaultExtPoint(url){
		return (
		{
			externalGraphic:url,
			graphicWidth:16,
			graphicHeight:16,
			rotation:125
		});
	}
	
		function tsforward(url){
		return (
		{
			externalGraphic:url,
			graphicWidth:20,
			graphicHeight:20,
			graphicXOffset: 4,
			graphicYOffset: 0,
			rotation:0
		});
	}
	
		function tsbackward(url){
		return (
		{
			externalGraphic:url,
			graphicWidth:20,
			graphicHeight:20,
			graphicXOffset: -4,
			graphicYOffset: 0,
			rotation:180
		});
	}
	
	if (type == "test"){
		
		map.addLayers([
/*			
			make_layer(QURL + "?data=node[kerb=lowered](bbox);out+skel;", "#66ff66", name="#c#&nbspkerb=lowered", 3, false),
			make_layer(QURL + "?data=node[kerb=raised](bbox);out+skel;", "#ff3300", name="#c#&nbspkerb=raised", 3, false),
			make_layer(QURL + "?data=node[kerb=flush](bbox);out+skel;", "#0066ff", name="#c#&nbspkerb=flush", 3, false),
			make_layer(QURL + "?data=node[kerb=no](bbox);out+skel;", "#ffff00", name="#c#&nbspkerb=no<hr>", 3, false),
*/
			make_layer(
				QURL + "?data=node[wheelchair=yes](bbox);out+skel;",
				name="#ex#&nbspwheelchair=yes",
				defaultExtPoint("https://image.flaticon.com/icons/png/512/9/9285.png"),
				false
			),

			make_layer(
				QURL + "?data=node[wheelchair=no](bbox);out+skel;",
				name="#c#&nbspwheelchair=no",
				defaultPoint("red"),
				false
			),

			make_layer(
				QURL + "?data=node[wheelchair=designated](bbox);out+skel;",
				name="#c#&nbspwheelchair=designated",
				defaultPoint("blue"),
				false
			),

			make_layer(
				QURL + "?data=node[wheelchair=limited](bbox);out+skel;",
				name="#c#&nbspwheelchair=limited<hr>",
				defaultPoint("yellow"),
				false
			),

			make_layer(
				QURL + "?data=node['obstacle:wheelchair'=yes](bbox);out+skel;",
				name="#c#&nbspobstacle:wheelchair=yes<hr>",
				defaultPoint("black"),
				false
			),

			make_layer(
				QURL + "?data=node[crossing=traffic_signals](bbox);out+skel;",
				name="#ex#&nbspcrossing=traffic_signals",
				defaultExtPoint("http://icons.iconarchive.com/icons/google/noto-emoji-travel-places/1024/42571-vertical-traffic-light-icon.png"),
				false
			),

			make_layer(
				QURL + "?data=node[crossing=no](bbox);out+skel;",
				name="#c#&nbspcrossing=no",
				defaultPoint("red"),
				false
			),

			make_layer(
				QURL + "?data=node[crossing=uncontrolled](bbox);out+skel;",
				name="#ex#&nbspcrossing=uncontrolled",
				defaultExtPoint("https://d30y9cdsu7xlg0.cloudfront.net/png/35167-200.png"),
				false
),
make_layer(
QURL + "?data=node['traffic_sign:backward'='ES:R1'](bbox);out+skel;",
name="#ex#&nbspES:R1 Backward ",
tsbackward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_R1.png"),
true
),
make_layer(
QURL + "?data=node['traffic_sign:backward'='ES:R2'](bbox);out+skel;",
name="#ex#&nbspES:R2 Backward ",
tsbackward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_R2.png"),
true
),
make_layer(
QURL + "?data=node['traffic_sign:backward'='ES:S13'](bbox);out+skel;",
name="#ex#&nbspES:S13 Backward ",
tsbackward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_S13.png"),
true
),
make_layer(
QURL + "?data=node['traffic_sign:backward'='ES:S572'](bbox);out+skel;",
name="#ex#&nbspES:S572 Backward ",
tsbackward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_S572.png"),
true
),
make_layer(
QURL + "?data=node['traffic_sign:backward'='ES:R305'](bbox);out+skel;",
name="#ex#&nbspES:R305 Backward ",
tsbackward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_R305.png"),
true
),
make_layer(
QURL + "?data=node['traffic_sign:backward'='ES:R101'](bbox);out+skel;",
name="#ex#&nbspES:R101 Backward ",
tsbackward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_R101.png"),
true
),
make_layer(
QURL + "?data=node['traffic_sign:backward'='ES:P15'](bbox);out+skel;",
name="#ex#&nbspES:P15 Backward ",
tsbackward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_P15.png"),
true
),
make_layer(
QURL + "?data=node['traffic_sign:forward'='ES:R1'](bbox);out+skel;",
name="#ex#&nbspES:R1 forward ",
tsforward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_R1.png"),
true
),
make_layer(
QURL + "?data=node['traffic_sign:forward'='ES:R2'](bbox);out+skel;",
name="#ex#&nbspES:R2 forward ",
tsforward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_R2.png"),
true
),
make_layer(
QURL + "?data=node['traffic_sign:forward'='ES:S13'](bbox);out+skel;",
name="#ex#&nbspES:S13 forward ",
tsforward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_S13.png"),
true
),
make_layer(
QURL + "?data=node['traffic_sign:forward'='ES:S572'](bbox);out+skel;",
name="#ex#&nbspES:S572 forward ",
tsforward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_S572.png"),
true
),
make_layer(
QURL + "?data=node['traffic_sign:forward'='ES:R305'](bbox);out+skel;",
name="#ex#&nbspES:R305 forward ",
tsforward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_R305.png"),
true
),
make_layer(
QURL + "?data=node['traffic_sign:forward'='ES:R101'](bbox);out+skel;",
name="#ex#&nbspES:R101 forward ",
tsforward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_R101.png"),
true
),
make_layer(
QURL + "?data=node['traffic_sign:forward'='ES:P15'](bbox);out+skel;",
name="#ex#&nbspES:P15 forward ",
tsforward("https://github.com/yopaseopor/beta_style_josm/raw/master/traffic_signs_EUR/ES/ES_P15.png"),
true
),
		make_layer(
				QURL + "?data=node[crossing=unmarked](bbox);out+skel;",
				name="#c#&nbspcrossing=unmarked<hr>",
				{
					strokeColor:"grey",
					strokeOpacity:0.9,
					strokeWidth:2,
					pointRadius:4,
					fillColor:"blue",
					fillOpacity:0.75
				},
				false
			),
/*
	  		//highways
            make_layer(QURL + "?data=(way[highway=cycleway](bbox);node(w);way[highway=path][bicycle=designated](bbox);node(w););out+skel;", "red",name="#l#highway=cycleway", 5, false),
			  
			make_layer(QURL + "?data=(way[highway=footway](bbox);node(w););out+skel;","#bd958b",name="#l#highway=footway", 5, false,"@0.8"),
			
			make_layer(QURL + "?data=(way[highway=path][bicycle!~'^designated'](bbox);node(w););out+skel;","#7b9541",name="#l#highway=path", 5, false,"@0.8"),
			
			make_layer(QURL + "?data=(way[highway=pedestrian](bbox);node(w););out+skel;", "#ff6500",name="#l#highway=pedestrian",5, false),
			  
			// tracks & tracktype
			make_layer(QURL + "?data=(way[highway=track](bbox);node(w););out+skel;","#bd9520",
			name="#l#highway=track", 5, false,"@0.8"),
			
            make_layer(QURL + "?data=(way[tracktype=grade1](bbox);node(w););out+skel;","#330000",name="#l#tracktype=grade1", 2, false),
			
			make_layer(QURL + "?data=(way[tracktype=grade2](bbox);node(w););out+skel;","#330000",name="#dl#tracktype=grade2", 3, false,"4 8"),
			
			make_layer(QURL + "?data=(way[tracktype=grade3](bbox);node(w););out+skel;","#A52A2A",name="#dl#tracktype=grade3", 2, false,"4 8"),
			
			make_layer(QURL + "?data=(way[tracktype=grade4](bbox);node(w););out+skel;","#A52A2A",name="#d#tracktype=grade4", 2, false,"1 6"),
			
			make_layer(QURL + "?data=(way[tracktype=grade5](bbox);node(w););out+skel;","black",name="#d#tracktype=grade5", 1, false,"1 3"),
			
			make_layer(QURL + "?data=(way[highway=track][tracktype!~'^grade'](bbox);node(w););out+skel;","white",name="#dl#tracktype unknown", 2, false,"4 8"),
			
			make_layer(QURL + "?data=(way[highway=track][cycleway](bbox);node(w););out+skel;","#ff008b",name="#dl#highway=track &<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspcycleway=*",5, false,"4 8"),

			// surface on paths & tracks
			make_layer(QURL + "?data=(way[highway~'^cycle|^foot|^path|^pedestrian|^track'][surface~'^asphalt|^pav|^concrete'](bbox);node(w););out+skel;","#000080",name="#l#surface = paved", 2, false,"@0.8"),
			 
			make_layer(QURL + "?data=(way[surface~'^cob'](bbox);node(w););out+skel;","#000080",name="#dl#surface=cobblestone", 4, false,"4 8@0.8"),
			
			make_layer(QURL + "?data=(way[surface~'^fine_gravel|.shell.'](bbox);node(w););out+skel;","#3965d5",name="#dl#surface=fine_gravel/shells", 3, false,"4 8@0.8"),
			
			// semi paved
			make_layer(QURL + "?data=(way[surface~'^gravel|^compact|^loam'](bbox);node(w););out+skel;","yellow",name="#dl#surface = semi-paved", 3, false,"4 8@0.8"),
			
			// unpaved
			make_layer(QURL + "?data=(way[surface~'^grass|^ground|^unpaved|^dirt|^earth|^sand|^woodchips|^pebble'](bbox);node(w););out+skel;","yellow",name="#d#surface = unpaved", 2, false,"1 3@0.8"),

			 // smoothness
			 make_layer(QURL + "?data=(way[smoothness=bad](bbox);node(w););out+skel;","#00FFFF", 
			 name="#dl#smoothness=bad", 3, false,"4 8"),
			 
			 make_layer(QURL + "?data=(way[smoothness~'^very_bad|^horrible|^very_horrible|^impassable'](bbox);node(w););out+skel;","#00FFFF", 
			 name="#l#smoothness very bad", 4, false)
*/			 
			]);
	}			
		if (type == "route"){

			map.addLayers([
			
			//highway=cycleway
			make_layer(
				QURL + "?data=(way[highway=cycleway](bbox);node(w);way[highway=path][bicycle=designated](bbox);node(w););out+skel;",
				name="#l#highway=cycleway<hr>Route relations:",
				defaultSolidLine("red"),
				false),
/*
			//LF-routes
			make_layer(QURL + "?data=(relation[route=bicycle][network=ncn](bbox);way(r)(bbox);node(w););out+skel;", "blue",name="#l#NCN route <i>(LF route)</i>", 12, false,"@0.6"),

			// knooppuntenroutes
			make_a_layer(QURL + "?data=relation(bbox)[network=rcn];(way(r)(bbox);node(w););out+skel;node(bbox)[rcn_ref];out;", "#00FFFF",name="#l#RCN route <i>(knooppuntroute)</i>", 8, false),

			make_layer(QURL + "?data=(relation[route=bicycle][network=lcn](bbox);way(r)(bbox);node(w););out+skel;", "#7CFC00",name="#dl#LCN route <i>(lokale route)</i>", 5, false,"4 8"),
			
			make_layer(QURL + "?data=(relation[network=icn](bbox);way(r)(bbox);node(w););out+skel;relation[network=icn];rel(r)(bbox);(way(r)(bbox);node(w););out skel;", "yellow",name="#dl#ICN route <i>(Int.route)</i>", 3, false,"4 8"),
			
			//route=mtb
            make_layer(QURL + "?data=(relation[route=mtb](bbox);way(r)(bbox);node(w););out+skel;", "#bd008b",name="#dl#MTB route", 4, false,"4 8"),
			
			//route=hiking, horse
            make_a_layer(QURL + "?data=(relation[route~'hik|foot|walk'](bbox);way(r)(bbox);node(w););out+skel;node[rwn_ref][rcn_ref!~'.'](bbox);out;", "#390000",name="#l#hiking route", 5, false),
			
			make_a_layer(QURL + "?data=(relation[route=horse](bbox);way(r)(bbox);node(w););out+skel;node(bbox)[rhn_ref];out;", "#7b9520",name="#l#horse route", 4, false),
			
			make_layer(QURL + "?data=(way[railway~'^abandoned|^disused|^dismantled'](bbox);node(w););out+skel;", "#7b3000",name="#dl#former railway lines", 4, false,"4 8"),
			
			make_a_layer(QURL + "?data=node[tourism=information](bbox);out;", "red", name="#co#info<hr>Cyclability (indicative):", 2, false),
			
			
			
			// non cyclable ways
			make_layer(QURL + "?data=(way[bicycle~'no|use_sidepath'](bbox);node(w);way[highway][access~'^no|^priv'][vehicle!~'yes'][bicycle!~'^no|^yes|^desig|^offic|^destin|^permis'][mtb!~'^yes|^desig|^offic|^destin|^permis']['mtb:scale'!~'^'](bbox);node(w);way[highway~'^foot|^path|^pedes|^platform|^steps|^bridleway|^prop|^constr'][access! ~'^no|^priv'][bicycle!~'^no|^yes|^desig|^offic|^destin|^permis'][mtb!~'^yes|^desig|^offic|^destin|^permis']['ramp:bicycle'!~'yes'](bbox);node(w);way[highway=track][horse=designated][access! ~'^no|^priv'][bicycle!~'^no|^yes|^desig|^offic|^destin|^permis'][mtb!~'^yes|^desig|^offic|^destin|^permis']['mtb:scale'!~'^'][route!=mtb](bbox);node(w););out+skel;", "#393020",name="<img style='vertical-align: middle;background-color:#393020;' src='img/line.gif'> 'non cycleable' ways", 4, false,"@0.5"),
						
 			// cyclable ways
			make_layer(QURL + "?data=(way[highway][highway!~'^motorway|^trunk|^foot|^path|^pedes|^platform|^steps|^bridleway|^prop|^constr'][access!~'^no|^priv'][bicycle!=no][horse!=designated][tracktype!~'grade4|grade5'](bbox);node(w);way[highway][access~'^no|^priv'][bicycle~'^yes|^desig|^offic|^destin|^permis'](bbox);node(w);way[highway~'^foot|^path|^pedes|^platform|^steps|^bridleway|^prop|^constr|^trunk|^motor'][bicycle~'^yes|^desig|^offic|^destin|^permis'](bbox);node(w);way[highway~'^foot|^path|^pedes|^platform|^steps|^bridleway|^prop|^constr'][mtb~'^yes|^desig|^offic|^destin|^permis'](bbox);node(w);way[highway=steps]['ramp:bicycle'=yes](bbox);node(w);way[route=ferry][bicycle!=no](bbox);node(w););out+skel;", "#39ff00",name="<img style='vertical-align: middle;background-color:#39ff00;' src='img/line.gif'> 'cycleable' ways<hr>", 4, false,"@0.6")
			
*/
			]);
	
			// OfficiÃ«le LF routes van het Fietsplatform
			var LFRoutes = new OpenLayers.Layer.WMS("<img style='vertical-align: middle;background-color: green;' src='img/line.gif'>&nbspOfficial LF routes (routedatabank.nl)",

                                       "https://www.routedatabank.nl/geoserver/wms",
                                       {layers: "routedatabank:lf_routes",
										transparent: true,
										format: "image/gif"
										},{
										visibility: false
										});
			map.addLayer(LFRoutes);		
			
			var fietsnetwerk1 = new OpenLayers.Layer.WMS("<img style='vertical-align: middle;background-color: green;' src='img/line.gif'>&nbspOfficial cycle node network (routedatabank.nl)",
                                       "https://www.routedatabank.nl/geoserver/wms",
                                       {layers: "routedatabank:fietsnetwerken_vrij",
										transparent: true,
										format: "image/gif"
										},{
										visibility: false
										});
			map.addLayer(fietsnetwerk1);	
			
			var fietsknoop1 = new OpenLayers.Layer.WMS("<img style='vertical-align: middle;background-color: white;' src='img/tocircle.gif'>&nbspOfficial cycle nodes (routedatabank.nl)",
                                       "https://www.routedatabank.nl/geoserver/wms",
                                       {layers: "routedatabank:fietsknooppunten_vrij",
										transparent: true,
										format: "image/gif"
										},{
										visibility: false
										});
			map.addLayer(fietsknoop1);
			
			var fietsnetwerk = new OpenLayers.Layer.WMS("<img style='vertical-align: middle;background-color: #39ff00;' src='img/line.gif'>&nbspOfficial cycle node network (pdok.nl)",
                                       "http://geodata.nationaalgeoregister.nl/fietsknooppuntennetwerk/wms",
                                       {layers: "netwerken",
										transparent: true,
										format: "image/gif"
										},{
										visibility: false
										});
			map.addLayer(fietsnetwerk);	
			
			var fietsknoop = new OpenLayers.Layer.WMS("<img style='vertical-align: middle;background-color: white;' src='img/tocircle.gif'>&nbspOfficial cycle nodes (pdok.nl)",
                                       "http://geodata.nationaalgeoregister.nl/fietsknooppuntennetwerk/wms",
                                       {layers: "knooppunten",
										transparent: true,
										format: "image/gif"
										},{
										visibility: false
										});
			map.addLayer(fietsknoop);
	
	}	

	if (type == "bugs"){
		//	dit maakt de layers voor de bugslaag
			map.addLayers([
			
						make_layer(
				QURL + "?data=node[wheelchair=no](bbox);out+skel;",
				name="#c#&nbspwheelchair=no",
				defaultPoint2("red"),
				false
			),
			
							make_layer(
				QURL + "?data=node[shop](bbox);out+skel;",
				name="#c#&nbspshop",
				defaultPoint2("yellow"),
				false
			),
			
								make_layer(
				QURL + "?data=node[amenity](bbox);out+skel;",
				name="#c#&nbspamenity",
				defaultPoint2("yellow"),
				false
			),
			
							make_layer(
				QURL + "?data=node[crossing](bbox);out+skel;",
				name="#c#&nbspcrossing only",
				defaultPoint3("red"),
				false
			),
			
								make_layer(
				QURL + "?data=node[crossing=traffic_signals](bbox);out+skel;",
				name="#c#&nbsptraffic_signals",
				defaultPoint4("blue"),
				false
			),	
			
									make_layer(
				QURL + "?data=node[crossing_ref=zebra](bbox);out+skel;",
				name="#c#&nbsptraffic_signals",
				defaultPoint5("grey"),
				false
			),
			
			
		/*	
		
			make_layer(QURL + "?data=(relation[route=bicycle](bbox);way[bicycle~'no|use_sidepath'](r);node(w););out+skel;", "#39ff00",name="#l#cycle routes & bicycle=no|use_sidepath",8, true,"5 10"),
	
			make_layer(QURL + "?data=(way[highway=cycleway][bicycle=no][moped!~'^yes|^designated'](bbox);node(w););out+skel;", "#ff00d5",name="#l#cycleway/bicycle=no<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspNote: temporarily blocked ways?",10, true),
			
			make_layer(QURL + "?data=(way[cycleway][bicycle~'no|use_sidepath'][cycleway!=no](bbox);node(w);way['cycleway:right'][bicycle=no](bbox);node(w);way['cycleway:left'][bicycle=no](bbox);node(w););out+skel;", "purple",name="#l#cycleway lane, track,<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspopposite & bicycle=no|use_sidepath",8, true,"5 10"),
			
			make_layer(QURL + "?data=(way[highway=crossing](bbox);node(w););out+skel;", "red",name="#l#highway=crossing<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp(should be a node, not a way)",8, true),
			
			make_layer(QURL + "?data=(way[highway=road](bbox);node(w);way[highway=cycleway][fixme](bbox);node(w);way[highway=cycleway][FIXME](bbox);node(w);way[cycleway][fixme](bbox);node(w);way[cycleway][FIXME](bbox);node(w););out+skel;", "green",name="#l#highway=road or cycleway<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspfixme (better tagging needed)",8, true),
			
			make_layer(QURL + "?data=(way[highway~'Pad|pad|Rad|rad|unknown'](bbox);node(w););out+skel;", "#ff6520",name="#l#highway=nonsense",8, true,"5 10@0.5"),
			
			make_layer(QURL + "?data=(relation[route=bicycle](bbox););way(r:\"\")(bbox)->.b;(way.b[oneway=yes];)->.c;(way.c[\"oneway:bicycle\"=no];way.c[cycleway=opposite];way.c[oneway=\"-1\"];way.c[oneway=\"bicycle:backward\"];way.c[oneway=\"bicycle:forward\"];way.c[cycleway=\"opposite_lane\"];)->.d;(.c;- .d;);(._;>;);out+skel;","#17202a",name="#l#oneway cycle route without b/f role",8, true,"5 10"),
			
			// overbodige tags?
			make_layer(QURL + "?data=(way[highway=cycleway][cycleway][cycleway!=shared][cycleway!=segregated](bbox);node(w););out+skel;", "#39ffd5",name="#l#highway=cycleway & cycleway=*",8, false),
      
			make_layer(QURL + "?data=(way[highway=cycleway][bicycle~'yes|designated'](bbox);node(w););out+skel;", "blue",name="#l#cycleway &<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbicycle=yes/designated<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp(needless tagging?)", 3, false,"5 10"),
			
			make_layer(QURL + "?data=(way[name~'^Fietspad|^fietspad|^pad$|^Pad$|cycleway|^path$|^Path$'](bbox);node(w);way[highway=cycleway][name!~'.'](bbox);node(w););out+skel;", "#ffff00",name="#l#cycleway/path without<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspstreetname (address search)",4, false),
*/
			]);
	}
	


}
	

function popuplinks(lonlat){

	  var thelink = "<div STYLE=\"margin:0px 0px 0px 0px;font-size: 8pt;\"><b>MAPA</b><br><a href=\"http://www.openstreetmap.org?lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17\" target=\"_blank\"><img src='img/osm.gif'>OSM</a>&nbsp&nbsp"
	  //COPIAR You can configure all services give you longitud and latitude and specific zoom in URL
	  //COPIAR thelink = thelink + "<a href=\"url" + lonlat.lat + "," + lonlat.lon + "zoomcode" target=\"_blank\"><img src='url icon'>Name of the service</a>&nbsp&nbsp";
	  //COPIAR Puedes configurar todo aquel servicio que te dé longitud (lonlat.lon) y latitud (lonla.lat) y un zoom concreto en la URL
	  //COPIAR thelink = thelink + "<a href=\"url" + lonlat.lat + "," + lonlat.lon + "codigozoom" target=\"_blank\"><img src='url icono'>Nombre del servicio</a>&nbsp&nbsp";
	  //COPIAR Pots configurar tots aquells serveis que et donin longitud i latitud i un zoom concre a l'adreça URL
	  //COPIAR thelink = thelink + "<a href=\"url" + lonlat.lat + "," + lonlat.lon + "codizoom" target=\"_blank\"><img src='url icona'>Nom del servei</a>&nbsp&nbsp";
	  thelink = thelink + "<a href=\"https://maps.google.es/maps?ll=" + lonlat.lat + "," + lonlat.lon + "&t=h&z=17\" target=\"_blank\"><img src='img/google.gif'>Google</a>&nbsp&nbsp";
	  thelink = thelink + "<a href=\"http://www.bing.com/maps/?v=2&cp=" + lonlat.lat + "~" + lonlat.lon + "&lvl=17&dir=0&sty=h&form=LMLTCC\" target=\"_blank\"><img src='img/bing.gif'>Bing</a><p>";
	  thelink = thelink + "<a href=\"https://wego.here.com/?map="  + (lonlat.lat) + "," + (lonlat.lon ) + "17,normal"  + "\" target=\"_blank\"><img src='img/here.png'>Here</a><hr>";
	  thelink = thelink + "<b>SATELITALES</b><br><a href=\"https://wego.here.com/?map="  + (lonlat.lat) + "," + (lonlat.lon ) + "17,satellite"  + "\" target=\"_blank\"><img src='img/digitalglobe.png'>DigitalGlobe</a>";
	  thelink = thelink + "<a href=\"https://www.google.es/maps/@" + lonlat.lat + "," + lonlat.lon + ",100m/data=!3m1!1e3\" target=\"_blank\"><img src='img/google.gif'>Google SAT</a><hr>&nbsp&nbsp";
	  thelink = thelink + "<b>A PIE DE CALLE</b><br><a href=\"https://www.mapillary.com/app/?lat="  + (lonlat.lat) + "&lng=" + (lonlat.lon ) + "&z=15"  + "\" target=\"_blank\"><img src='img/mapillary.png'>Mapillary</a>";
	  thelink = thelink + "<a href=\"https://openstreetcam.org/map/@"  + (lonlat.lat) + "," + (lonlat.lon ) + ",17z"  + "\" target=\"_blank\"><img src='img/openstreetcam.png'>OpenStreetCam</a><hr>";
	   thelink = thelink + "<b>RECORRIDOS</b><br><a href=\"http://www.openstreetmap.org?lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17&layers=CD\" target=\"_blank\"><img src='img/osm.gif'>OSM Cycle Map</a>"
	  thelink = thelink + "<a href=\"http://hiking.waymarkedtrails.org/nl/?zoom=13" +  "&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "\" target=\"_blank\"><img src='img/map_hiking.png'>Waymarked trails</a> ";
	  thelink = thelink + "<a href=\"https://www.wikiloc.com/wikiloc/map.do?lt=" + lonlat.lat + "&ln=" + lonlat.lon + "&z=17" + "\" target=\"_blank\"><img src='img/wikiloc.png'>Wikiloc</a><hr>";
	  thelink = thelink + "<b>TRANSPORTE</b><br><a href=\"http://www.openstreetmap.org?lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17&layers=TB\" target=\"_blank\"><img src='img/osm.gif'>OSM Public Transport</a>"
	  thelink = thelink + "<a href=\"http://www.xn--pnvkarte-m4a.de/#" + lonlat.lon + ";" + lonlat.lat + ";15" + "\" target=\"_blank\"><img src='img/opvnkarte.png'>Opvnkarte</a><hr> ";
	  
	  
	
	  var area = 0.04
	  var ctop = lonlat.lat + area;
	  var cbottom = ctop - (2 * area);
	  var cleft = lonlat.lon - area;
	  var cright = cleft + (2 * area); 
	  
	  thelink = thelink + "<b>Editar :</b><br><a href=\"http://localhost:8111/load_and_zoom?top=" + ctop + "&bottom=" + cbottom + "&left=" + cleft + "&right=" + cright + "\" target=\"josm_frame\">JOSM (necesitas conector)</a><br>";
	  thelink = thelink + "<a href=\"http://www.openstreetmap.org/edit?editor=id&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17\" target=\"_blank\">Editor iD</a><br>&nbsp&nbsp";
	  thelink = thelink + "<a href=\"http://www.openstreetmap.org/edit?editor=potlatch2&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17\" target=\"_blank\">Potlatch 2</a><br>&nbsp&nbsp";	
	  thelink = thelink + "<a href=\"http://www.openstreetmap.org/edit?&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17\" target=\"_blank\">Potlatch 1</a><hr>";
	  
	  thelink = thelink + "<b>Errores en OSM </b><br><a href=\"http://www.openstreetmap.org/#map=12" + "/" + lonlat.lat + "/" + lonlat.lon + "&layers=N" + "\" target=_blank> Notas en Openstreetmap</a><br \>";
	  thelink = thelink + "<a href=\"http://keepright.ipax.at/report_map.php?" + "&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=14&&layers=B0T&ch=0%2C50%2C191%2C195%2C201%2C205%2C206%2C311%2C312%2C313%2C402&show_ign=1&show_tmpign=1" + "\" target=_blank> Keepright</a><hr>"; 
	  thelink = thelink + "</b></div>";
	  return thelink;
	  
	}
