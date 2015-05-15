define(function (require) {
    var Utils = require("atmoapp/utils");

    function updateDOM(response) {
        var pressureTable = document.getElementsByTagName("pressure-table")[0];
        pressureTable.aPressureDays = response[1];
        document.getElementById("city").innerHTML = "Showing pressure for " + response[0];
        document.getElementsByTagName("paper-input")[0].classList.remove("invalid-city");
    }

    function markInvalidCity(error) {
        console.log("marking city as invalid");
        document.getElementsByTagName("paper-input")[0].classList.add("invalid-city");
        var pressureTable = document.getElementsByTagName("pressure-table")[0];
        pressureTable.aPressureDays = [];
        document.getElementById("city").innerHTML = "Error occurred while getting data. Please check city name";
    }

    window.app = {
        getAtmoClicked: function(oEvent) {
            document.getElementById("city").innerHTML = "";
            Utils.showByCity(document.getElementsByTagName("paper-input")[0].value).then(updateDOM).catch(markInvalidCity);
        }
    };

    document.querySelector("#buttonGet").addEventListener("click", function(e) {
        app.getAtmoClicked(e);
    });

    Utils.showGraph().then(updateDOM).catch(markInvalidCity);
    return window.app;
});
