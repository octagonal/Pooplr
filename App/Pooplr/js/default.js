// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

	var Toilets = new ToiletsModel();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
				
                var ToiletMap = new ToiletMapModel("mapDiv");
                var UI = new UIModel();

                Toilets.on("data-received", function (received, allToilets) {
                    //console.log("Toilets: " + allToilets.length);
                    //console.dir(allToilets);
                })
                Toilets.on("data-completed", function (toilets) {
                    ToiletMap.trigger("data-completed", toilets);
                });
                Toilets.trigger("data-request");

                UI.on("appbar-click", function (what) {
                    switch (what) {
                        case "refresh":
                            ToiletMap.trigger("refresh");
                            break;
                        case "directions":
                            ToiletMap.trigger("directions");
                            break;
                        case "location":
                            ToiletMap.trigger("location");
                            break;
                    }
                })

            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();
