

var uiSettings = new Windows.UI.ViewManagement.UISettings();


(function () {

    var navbarInvoked = function (ev) {
        var navbarCommand = ev.detail.navbarCommand;
        WinJS.log && WinJS.log(navbarCommand.label + " NavBarCommand invoked", "sample", "status");
        document.querySelector('select').focus();
    }

    $('#NavBar').on('invoked', navbarInvoked);

})();