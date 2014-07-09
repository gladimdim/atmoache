function requestOkText(url) {
    "use strict";
    /*global XMLHttpRequest */
    /*global Q */
    var request = new XMLHttpRequest(),
        deferred = Q.defer();

    function onload() {
        if (request.status === 200) {
            deferred.resolve(request.responseText);
        } else {
            deferred.reject(new Error("Status code was " + request.status));
        }
    }

    function onerror() {
        deferred.reject(new Error("Can't XHR " + JSON.stringify(url)));
    }

    function onprogress(event) {
        deferred.notify(event.loaded / event.total);
    }
    request.open("GET", url, true);
    request.onload = onload;
    request.onerror = onerror;
    request.onprogress = onprogress;
    request.send();



    return deferred.promise;
}

function getPreviousDayDate() {
    "use strict";
    var d = new Date();
    d.setHours(d.getHours() - 12);
    return (d / 1000).toFixed(0);
}

function calculateDifferences(aPressures) {
    "use strict";
    var aReturn = [0], i, a, b;
    for (i = 1; i < aPressures.length; i = i + 1) {
        a = aPressures[i - 1].pressure;
        b = aPressures[i].pressure;
        aReturn.push((a - b).toFixed(0));
    }
    return aReturn;
}

function setInvalidCity() {
    "use strict";
    /*global $ */
    $("#cityText").addClass("invalid-city");
    $("#cityText").attr("placeholder", "Enter valid city");
}

function colorForDiff(diff) {
    "use strict";
    var red = 0.4588 + (1 - 0.4588) * diff / 10,
        green = 0.7020,
        blue = 0.6078;

    if (diff < 5) {
        green = green + (0.8 - green) * diff / 4;
        blue = blue + (0.6588 - blue) * diff / 10;
    } else if (diff >= 5) {
        green = green - (green - 0.0235) * diff / 20;
        blue = blue - (blue - 0.1216) * diff / 20;
    }
    return [(red * 255).toFixed(0), (green * 255).toFixed(0), (blue * 255).toFixed(0)];
}

function getPreviousDay(sURL, sTodayPressure) {
    "use strict";
    requestOkText(sURL).then(function (responseText) {
        /*global console */
        var oJSON = JSON.parse(responseText),
            prevPressure = oJSON.list[0].main.pressure,
            color = colorForDiff(Math.abs((sTodayPressure - prevPressure).toFixed(0))),
            directionArrow = prevPressure - sTodayPressure > 0 ? '\u2193' : '\u2191';
        console.log("yesterdays pressure: " + prevPressure);
        $(".div-diff")[0].setAttribute("style", "background-color: rgb(" + color + ")");
        $(".div-diff")[0].innerText = "Today " + directionArrow;
    }).catch(function (error) {
        console.log("Error while getting previous forecast: " + error);
    });
}

function showProgressBar() {
    var dPressure = $("#pressure");
    $("#progressSection").show();
    /*dPressure.append("<div id='progressSection'>" +
        "<div id='progressText'>Getting pressure for your location</div>" +
        "<progress id='progressbar'></progress>" +
        "</div>");*/
}

function hideProgressBar() {
    $("#progressSection").hide();
}

function getForecastWithString(sURL, sPrevURL) {
    "use strict";
    requestOkText(sURL).then(function (responseText) {
        var oJSON = JSON.parse(responseText),
            i,
            aDiffs,
            currentDate = new Date(),
            directionArrow,
            color;
        if (!oJSON.hasOwnProperty("city")) {
            setInvalidCity();
            return;
        }
        $("#city").show().text(oJSON.city.name);
        aDiffs = calculateDifferences(oJSON.list);
        for (i = 0; i < aDiffs.length; i = i + 1) {
            currentDate.setHours(currentDate.getHours() + 24 * i);
            directionArrow = aDiffs[i] > 0 ? '\u2193' : '\u2191';
            color = colorForDiff(Math.abs(aDiffs[i]));
            $("#pressure").append("<div class='div-diff' style='background-color: rgb( " + color + ");'>" + currentDate.toDateString() + " " + directionArrow + "</div>");
        }
        getPreviousDay(sPrevURL, oJSON.list[0].pressure);
    }).catch(function (error) {
        $("#city").hide();
        $("#pressure").text("Failed to get data from http://www.openweathermap.org site.");
        console.log("Error while getting data: " + error);
    }).finally(function () {
        hideProgressBar();
    }).done();
}

function showByGeolocation(geolocation) {
    "use strict";
    var sURL = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + geolocation.coords.latitude + "&lon=" + geolocation.coords.longitude + "&cnt=7&mode=json",
        sPrevURL = "http://api.openweathermap.org/data/2.5/history/city?lat=" + geolocation.coords.latitude + "&lon=" + geolocation.coords.longitude + "&cnt=1" + "&start=" + getPreviousDayDate() + "&type=hour";
    getForecastWithString(sURL, sPrevURL);
}

function removeInvalidCity() {
    "use strict";
    $("#cityText").removeClass("invalid-city");
    $("#cityText").attr("placeholder", "Enter city");
}

function showByCity(sCity) {
    "use strict";
    var sURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + sCity + "&cnt=7&mode=json",
        sPreviousDayURL = "http://api.openweathermap.org/data/2.5/history/city?q=" + sCity + "&type=hour&start=" + getPreviousDayDate() + "&cnt=1";
    getForecastWithString(sURL, sPreviousDayURL);
}

function handleRejection() {
    "use strict";
    $("#cityForm").show();
    hideProgressBar();
    $('#city-button').click(function () {
        var sCity = $("#cityText").val();
        if (sCity && sCity !== "") {
            removeInvalidCity();
            showProgressBar();
            showByCity($("#cityText").val());
        } else {
            setInvalidCity();
        }
    });
}

function showGraph() {
    "use strict";
    /*global navigator */
    showProgressBar();
    if (navigator.geolocation) {
        $("#cityForm").hide();
        navigator.geolocation.getCurrentPosition(showByGeolocation, handleRejection);
    } else {
        console.log("nope");
    }
}
