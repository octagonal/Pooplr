
function GentModel() {
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
    var self = this;
    var Gent = new GentModel();
    
    $.observable(self);

    var getData = function () {
        Gent.one("data-response", function (GentData) {
            var allToilets = GentData;
            self.trigger("data-received", allToilets);
        })
        Gent.trigger("data-request");
    }
   
    self.on("data-request", function () {
        getData();
    })

}