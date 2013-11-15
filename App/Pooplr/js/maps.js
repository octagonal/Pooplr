
function ToiletMapModel(elementId) {
    /// <summary>Toilet Map</summary>

    /// Events:
    ///    - map-ready - map is ready

    /// Listeners:
    ///     - data-completed - init map data

    var self = this;

    var mapOptions = {
      credentials: "AtnRnvtS2tavLV6OaHT3DJwmhWvOC0Vyiw4Pponx_vTLUDoOXrwwKjQvJRlZQMUb",
      showBreadcrumb: true,
      fixedMapPosition: true,
      showMapTypeSelector: false
    };
    $.observable(self);

    var initMap = function () {
        self.map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), mapOptions);

        self.map.setView({ center: new Microsoft.Maps.Location(50.80, 4.4), zoom: 9 });
        self.trigger("map-ready");
    }

    var AddPin = function(loc) {
        var pin = new Microsoft.Maps.Pushpin(loc);
        self.map.entities.push(pin);
    }

	//map.entities.clear(); 
	loc = new Windows.Devices.Geolocation.Geolocator();
	loc.getGeopositionAsync().then(getPositionHandler, errorHandler);
	
	function getPositionHandler(pos) {
       console.log(pos.coordinate.latitude);
       console.log(pos.coordinate.longitude);
    }

	function errorHandler(e){ console.log("Err =>" + e.message);}

	//console.log(loc.locationStatus);
	//displayAlert('Current location set, based on your browser support for geo location API');

	var processToilets = function(toilets) {
		// long,lat,distance,id,fid,objectid,situering,type_sanit,type_locat,prijs_toeg,open7op7da,openuren,idgent
		for (var i=0; i<toilets.length;i++) {
			var long = toilets[i].long || toilets[i].Longitude;
			var lat = toilets[i].lat || toilets[i].Latitude;
			var loc = new Microsoft.Maps.Location(lat, long);
			AddPin(loc);
		}
	}

    Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: initMap });

    self.on("data-completed", function (toilets) {
		processToilets(toilets);
    })
}
