define(function (require) {
    var Utils = require("atmoapp/utils");
    function updateDOM(response) {
        var pressureTable = document.getElementsByTagName("pressure-table")[0];
        pressureTable.aPressureDays = response[1];
        document.getElementById("city").innerHTML = "Showing pressure for " + response[0];
    }
    window.app = {
        getAtmoClicked: function(oEvent) {
            Utils.showByCity(document.getElementById("cityText").value).then(updateDOM);
        }
    };
    Utils.showGraph().then(updateDOM);
    return window.app;
});
