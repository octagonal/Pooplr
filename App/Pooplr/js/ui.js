

var uiSettings = new Windows.UI.ViewManagement.UISettings();


function UIModel() {
    /// <summary>Controller for Windows UI.</summary>

    /// Events:
    ///     - navbar-invoked - Navbar has been opened
    ///     - appbar-click - Button on appbar clicked

    /// Listeners:
    ///     - data-request - init collecting data

    var self = this;

    $.observable(self);

    $("#AppBar #cmdDirections").on("click", function () {
        self.trigger("appbar-click", "directions");
    })
    $("#AppBar #cmdLocation").on("click", function () {
        self.trigger("appbar-click", "location");
    })
};