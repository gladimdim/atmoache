import {showGraph, showByCity} from "../atmoapp/utils";
import {i18n} from "../atmoapp/i18n";

var i18 = new i18n();
var app = {
    getCityInputField: function() {
        return document.getElementsByTagName("paper-input")[0];
    },
    getStatusDiv: function() {
        return document.getElementById("city");
    },
    initListeners: function() {
        document.querySelector("#buttonGet").addEventListener("click", function(e) {
            app.getProgressBarElement().classList.remove("hidden-element");
            document.getElementById("city").innerHTML = "";
            showByCity(app.getCityInputField().value).then(updateDOM).catch(markInvalidCity);
        });
    },
    getPressureTableElement: function () {
        return document.getElementsByTagName("pressure-table")[0];
    },
    getProgressBarElement: function() {
        return document.querySelector("paper-progress");
    }
};

function updateDOM(response) {
    var pressureTable = app.getPressureTableElement();
    pressureTable.aPressureDays = response[1];
    app.getStatusDiv().innerHTML = i18.getTranslationForKey("lDataForCity") + response[0];
    app.getCityInputField().classList.remove("invalid-city");
    app.getProgressBarElement().classList.add("hidden-element");

}

function markInvalidCity(error) {
    app.getCityInputField().classList.add("invalid-city");
    var pressureTable = app.getPressureTableElement();
    pressureTable.aPressureDays = [];
    app.getStatusDiv().innerHTML = i18.getTranslationForKey("eCheckCityName");
}

app.initListeners();

showGraph().then(updateDOM).catch(markInvalidCity);
window.app = app;
window.i18 = i18;