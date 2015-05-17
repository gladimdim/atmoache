define(function (require) {
    var Utils = require("atmoapp/utils");

    var app = {
        getCityInputField: function() {
            return document.getElementsByTagName("paper-input")[0];
        },

        getStatusDiv: function() {
            return document.getElementById("city");
        },

        initListeners: function() {
            document.querySelector("#buttonGet").addEventListener("click", function(e) {
                document.getElementById("city").innerHTML = "";
                debugger;
                Utils.showByCity(app.getCityInputField().value).then(updateDOM).catch(markInvalidCity);
            });
        },

        getPressureTableElement: function () {
            return document.getElementsByTagName("pressure-table")[0];
        }
    };

    function updateDOM(response) {
        var pressureTable = app.getPressureTableElement();
        pressureTable.aPressureDays = response[1];
        app.getStatusDiv().innerHTML = "Showing pressure for " + response[0];
        app.getCityInputField().classList.remove("invalid-city");
    }
    function markInvalidCity(error) {
        app.getCityInputField().classList.add("invalid-city");
        var pressureTable = app.getPressureTableElement();
        pressureTable.aPressureDays = [];
        app.getStatusDiv().innerHTML = "Error occurred while getting data. Please check city name";
    }

    app.initListeners();    

    Utils.showGraph().then(updateDOM).catch(markInvalidCity);

    window.app = app;
});
