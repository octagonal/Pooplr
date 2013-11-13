Microsoft.Maps.loadModule('Microsoft.Maps.Map', { callback: initMap });
function initMap() {
    var map;

    var mapOptions =
    {
        credentials: "AtnRnvtS2tavLV6OaHT3DJwmhWvOC0Vyiw4Pponx_vTLUDoOXrwwKjQvJRlZQMUb"
    };

    map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), mapOptions);
    map.setView({ center: new Microsoft.Maps.Location(50.80, 4.4), zoom: 9 });
}