﻿
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
    self.closestLocation = null;

    var hasMyLocation = false,
        allPinsPlaced = false;
    var toiletLocations = [];
    var infoBox = null;
    var ranonce = false;

    var directionsManager;

    var mapOptions = {
      credentials: "AtnRnvtS2tavLV6OaHT3DJwmhWvOC0Vyiw4Pponx_vTLUDoOXrwwKjQvJRlZQMUb",
      showBreadcrumb: false,
      fixedMapPosition: true,
      showMapTypeSelector: true
    };
    $.observable(self);

    var initMap = function () {
        self.map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), mapOptions);
        infoBox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), {
            visible: false
        })
        self.map.entities.push(infoBox);

        directionsManager = new Microsoft.Maps.Directions.DirectionsManager(self.map);
        directionsManager.setRequestOptions({
            routeMode: Microsoft.Maps.Directions.RouteMode.walking,
            routeDraggable: false
        });

        directionsManager.setRenderOptions({
            waypointPushpinOptions: { visible: false },
            viapointPushpinOptions: { visible: false }
        });

        // België: 50.80, 4.4
        self.map.setView({ center: new Microsoft.Maps.Location(50.80, 4.4), zoom: 9 });
        Microsoft.Maps.Events.addHandler(self.map, 'click', displayEventInfo);
        Microsoft.Maps.loadModule("Microsoft.Maps.Directions", { callback: DirectionsLoaded });
        self.trigger("map-ready");
    }
    
    function displayEventInfo(e) {
        if (e.targetType == "pushpin") {
            if (e.target.isMe) return false;
            var point = new Microsoft.Maps.Point(e.getX(), e.getY());
            var loc = e.target
            infoBox.setLocation(e.target.getLocation());
            var title = "";
            if (e.target.Title && e.target.Title.length > 1) {
                title = e.target.Title;
            } else { title = "Openbaar toilet"; }
            infoBox.setOptions({
                visible: true,
                title: title
            })
            //document.getElementById("textBox").value = loc.latitude + ", " + loc.longitude;
            console.log(loc)

            if (self.myLocation) drawRoute(self.myLocation, e.target.getLocation());
        }
    }

    var AddPin = function(loc,toilet) {
        var pin = new Microsoft.Maps.Pushpin(loc, {
            icon: '/images/icon32.png',
            width: 32, height: 32,
            draggable: false,
        });

        pin.Title = toilet.omschrijving || toilet.situering || toilet.Description;
 
        // Add the pushpin and info box to the map
        self.map.entities.push(pin);
    }

    function hideInfobox(e)
    {
        infoBox.setOptions({ visible: false });
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
        self.closestLocation = toiletLocations[n]
        self.trigger("closest-found");
    }


    var amIDoneYet = function () {
        if (hasMyLocation && allPinsPlaced && !ranonce) {
            findDirections();
            ranonce = true;
        }
    }

    function DirectionsLoaded() {
        loc = new Windows.Devices.Geolocation.Geolocator();
        loc.getGeopositionAsync().then(getCurrentLocationHandler, errorHandler);

        function getCurrentLocationHandler(pos) {
            var loc = new Microsoft.Maps.Location(pos.coordinate.latitude, pos.coordinate.longitude);
            var pin = new Microsoft.Maps.Pushpin(loc, {
                icon: '/images/me48.png',
                width: 23, height: 48,
                draggable: false
            });
            pin.isMe = true;
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
			AddPin(loc,toilets[i]);
		}
		allPinsPlaced = true;
		amIDoneYet();
	}

	var drawRoute = function (locSelf, locClosest) {
	    directionsManager.resetDirections();
	    directionsManager.clearDisplay();

	    directionsManager.setRequestOptions({
	        routeMode: Microsoft.Maps.Directions.RouteMode.walking,
	        routeDraggable: false
	    });

	    directionsManager.setRenderOptions({
	        waypointPushpinOptions: { visible: false },
	        viapointPushpinOptions: { visible: false }
	    });


	    // Create start and end waypoints
	    var startWaypoint = new Microsoft.Maps.Directions.Waypoint({ location: locSelf });
	    var endWaypoint = new Microsoft.Maps.Directions.Waypoint({ location: locClosest });

	    directionsManager.addWaypoint(startWaypoint);
	    directionsManager.addWaypoint(endWaypoint);

	    // Set the id of the div to use to display the directions
	    //directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('itineraryDiv') });

	    // Specify a handler for when an error and success occurs
	    Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', displayError);

	    // Calculate directions, which displays a route on the map
	    directionsManager.calculateDirections();

	}

	function displayError(e) {
	    // Display the error message
	    alert(e.message);

	}

    Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: initMap });

    self.on("data-completed", function (toilets) {
		processToilets(toilets);
    })

    self.on("closest-found", function () {
        drawRoute(self.myLocation,self.closestLocation);
    })

    self.on("directions", function () {
        drawRoute(self.myLocation, self.closestLocation);
        infoBox.setOptions({
            visible: false
        })
    })

    self.on("location", function () {
        loc = new Windows.Devices.Geolocation.Geolocator();
        loc.getGeopositionAsync().then(getCurrentLocationHandler, errorHandler);

        function getCurrentLocationHandler(pos) {
            var loc = new Microsoft.Maps.Location(pos.coordinate.latitude, pos.coordinate.longitude);
            var pin = new Microsoft.Maps.Pushpin(loc, {
                icon: '/images/me48.png',
                width: 23, height: 48,
                draggable: true
            });
            self.map.entities.push(pin);

            self.myLocation = loc;
            hasMyLocation = true;
            amIDoneYet();
        }
        function errorHandler(e) { console.log("Err =>" + e.message); }
    })
}
