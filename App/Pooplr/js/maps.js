
function checkDistance(me, marker) {
    // x = LAT || y = LONG

    var lat1 = me.latitude;
    var lon1 = me.longitude;

    var lat2 = marker.latitude;
    var lon2 = marker.longitude;

    var earthRadius = 3958.75; // radius of the eath in meters
    lat1 = (lat1 * Math.PI) / 180;
    lon1 = (lon1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;
    lon2 = (lon2 * Math.PI) / 180;

    var dlon = lon2 - lon1;
    var dlat = lat2 - lat1;

    var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
			Math.cos(lat1) * Math.cos(lat2) *
			Math.sin(dlon / 2) * Math.sin(dlon / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var meterConversion = 1609;
    var distance = earthRadius * c * meterConversion;

    return distance;
}



function ToiletMapModel(elementId) {
    /// <summary>Toilet Map</summary>

    /// Events:
    ///    - map-ready - map is ready

    /// Listeners:
    ///     - data-completed - init map data

    var self = this;

    self.myLocation = null;

    var hasMyLocation = false,
        allPinsPlaced = false;
    var toiletLocations = [];

    var mapOptions = {
      credentials: "AtnRnvtS2tavLV6OaHT3DJwmhWvOC0Vyiw4Pponx_vTLUDoOXrwwKjQvJRlZQMUb",
      showBreadcrumb: true,
      fixedMapPosition: true,
      showMapTypeSelector: false
    };
    $.observable(self);

    var initMap = function () {
        self.map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), mapOptions);

        // België: 50.80, 4.4
        self.map.setView({ center: new Microsoft.Maps.Location(50.80, 4.4), zoom: 9 });
        Microsoft.Maps.loadModule("Microsoft.Maps.Directions", { callback: DirectionsLoaded });
        self.trigger("map-ready");
    }

    var AddPin = function(loc) {
        var pin = new Microsoft.Maps.Pushpin(loc);
        self.map.entities.push(pin);
    }

    var findDirections = function () {
        console.log("looking for nearest");

        var nearest = 99999999999;
        var n = -1;
        for (var i = 0; i < toiletLocations.length; i++) {
            var currentToilet = toiletLocations[i];
            var distance = checkDistance(self.myLocation, currentToilet);
            if (distance < nearest) {
                nearest = distance;
                n = i;
            }
        }
        console.log("closest = " + nearest, toiletLocations[n]);
    }

    var amIDoneYet = function () {
        if (hasMyLocation && allPinsPlaced) {
            findDirections();
        }
    }

    function DirectionsLoaded() {
        loc = new Windows.Devices.Geolocation.Geolocator();
        loc.getGeopositionAsync().then(getCurrentLocationHandler, errorHandler);

        function getCurrentLocationHandler(pos) {
            var loc = new Microsoft.Maps.Location(pos.coordinate.latitude, pos.coordinate.longitude);
            var pin = new Microsoft.Maps.Pushpin(loc);
            self.map.entities.push(pin);

            self.myLocation = loc;
            hasMyLocation = true;
            amIDoneYet();
        }

        function errorHandler(e) { console.log("Err =>" + e.message); }
        //Geolocation
    }

	var processToilets = function(toilets) {
		// long,lat,distance,id,fid,objectid,situering,type_sanit,type_locat,prijs_toeg,open7op7da,openuren,idgent
		for (var i=0; i<toilets.length;i++) {
			var long = toilets[i].long || toilets[i].Longitude;
			var lat = toilets[i].lat || toilets[i].Latitude;
			var loc = new Microsoft.Maps.Location(lat, long);
			toiletLocations[toiletLocations.length] = loc;
			AddPin(loc);
		}
		allPinsPlaced = true;
		amIDoneYet();
	}

    Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: initMap });

    self.on("data-completed", function (toilets) {
		processToilets(toilets);
    })
}
