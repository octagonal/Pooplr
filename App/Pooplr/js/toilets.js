

function BrusselsModel() {
    /// <summary>Pulls data from the Brussels OpenData. Both toilets and urinoirs.</summary>

    /// Events:
    ///     - data-response - data collected and sent back to listeners: toilets[]

    /// Listeners:
    ///     - data-request - init collecting data

    var self = this;
    var url = "/res/brussel.json";

    self.content = [];

    var pull = function () {
        $.get(url, function (data) {
            if (data) {
                if (typeof (data) != typeof ([])) data = JSON.parse(data);
                self.content = data;
                self.trigger("data-response", self.content);
            }
        })
    }

    $.observable(self);

    self.on("data-request", function () { pull(); })

}

function AntwerpModel() {
    /// <summary>Pulls data from the Antwerpen OpenData.</summary>

    /// Events:
    ///     - data-response - data collected and sent back to listeners: toilets[]

    /// Listeners:
    ///     - data-request - init collecting data

    var self = this;
    var url = "http://api.antwerpen.be/v1/infrastructuur/openbaartoilet.json";

    self.content = [];

    var pull = function () {
        $.get(url, function (data) {
            if (data) {
                if (data.openbaartoilet) {
                    self.content = data.openbaartoilet;
                    self.trigger("data-response", self.content);
                }
            }
        })
    }

    $.observable(self);

    self.on("data-request", function () { pull(); })

}

function GentModel() {
    /// <summary>Pulls data from OpenData Ghent.</summary>

    /// Events:
    ///     - data-response - data collected and sent back to listeners: toilets[]

    /// Listeners:
    ///     - data-request - init collecting data

    var self = this;
    var url = "http://datatank.gent.be/Infrastructuur/PubliekSanitair.json";

    self.content = [];

    var pull = function () {
        $.get(url, function (data) {
            if (data) {
                if (data.PubliekSanitair) {
                    self.content = data.PubliekSanitair;
                    self.trigger("data-response", self.content);
                }
            }
        })
    }

    $.observable(self);

    self.on("data-request", function () { pull();})
}



function ToiletsModel() {
    /// <summary>A Model for Toilets. Use with new ToiletsModel();</summary>

    /// Events:
    ///     - data-received - part of data received: received{}, toilets[]
    ///     - data-completed - all data collected: toilets[]

    /// Listeners:
    ///     - data-request - init collecting data

    var self = this;

    self.Gent = new GentModel();
    self.Antwerp = new AntwerpModel();
    self.Brussels = new BrusselsModel();

    var received = {
        gent: false,
        antwerp: false,
        brussels: false
    }

    self.toilets = [];
    
    $.observable(self);

    var isComplete = function() {
        if (received.gent && received.antwerp && received.brussels) {
            self.trigger("data-completed", self.toilets);
            return true;
        }
    }

    self.getData = function () {
        /// <summary>Sends "data-response" events with: received{}, toilets[].</summary>

        var combineAndComplete = function () {
            self.toilets = self.Gent.content.concat(self.Antwerp.content, self.Brussels.content);
            self.trigger("data-received", received, self.toilets);
            isComplete();
        }

        self.Gent.one("data-response", function (GentData) {
            received.gent = true;
            combineAndComplete();
        })
        self.Antwerp.one("data-response", function (AntwerpData) {
            received.antwerp = true;
            combineAndComplete();
        })
        self.Brussels.one("data-response", function (BrusselsData) {
            received.brussels = true;
            combineAndComplete();
        })

        self.Gent.trigger("data-request");
        self.Antwerp.trigger("data-request");
        self.Brussels.trigger("data-request");
    }
   
    self.on("data-request", function () {
        self.getData();
    })

}