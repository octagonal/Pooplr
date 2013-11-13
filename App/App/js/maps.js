
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

    Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: initMap });

    

    self.on("data-completed", function (toilets) {
        console.log("muh toilets", toilets.length);
    })
}
