var fnShowByGeolocation = function(geolocation) {
    var sURL = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + geolocation.coords.latitude +"&lon=" + geolocation.coords.longitude + "&cnt=7&mode=json";
    var sPrevURL = "http://api.openweathermap.org/data/2.5/history/city?lat=" + geolocation.coords.latitude +"&lon=" + geolocation.coords.longitude + "&cnt=1" + "&start=" + getPreviousDayDate() + "&type=hour";
    fnGetForecastWithString(sURL, sPrevURL);
};

var fnGetForecastWithString = function(sURL, sPrevURL) {
    var xml = new XMLHttpRequest();
    xml.addEventListener('readystatechange', function () {
    	if (xml.readyState === 4 && xml.status === 200) {
    	    var oJSON = JSON.parse(xml.responseText);
    	    if (!oJSON.hasOwnProperty("city")) {
            setInvalidCity();
        		return;
    	    }
    	    document.getElementById("pressure").innerHTML = "";
    	    $("#city").text(oJSON.city.name);
    	    var aDiffs = fnCalculateDifferences(oJSON.list);
    	    for (var i = 0; i < aDiffs.length; i++) {
        		var currentDate = new Date();
        		currentDate.setHours(currentDate.getHours() + 24 * i);
            var directionArrow = aDiffs[i] > 0 ? '\u2193' : '\u2191';
        		var color = colorForDiff(Math.abs(aDiffs[i]));
        		$("#pressure").append("<div class='div-diff' style='background-color: rgb( " + color + ");'>" + currentDate.toDateString() + " " + directionArrow + "</div>");
    	    }
          getPreviousDay(sPrevURL, oJSON.list[0].pressure);
    	}
    });

    xml.open("get", sURL, true);
    xml.send();
};

function getPreviousDay(sURL, sTodayPressure) {
    var xml = new XMLHttpRequest();

    xml.addEventListener('readystatechange', function() {
      if (xml.readyState === 4 && xml.status === 200) {
        var oJSON = JSON.parse(xml.responseText);
        var prevPressure = oJSON.list[0].main.pressure;
        var color = colorForDiff(Math.abs((sTodayPressure - prevPressure).toFixed(0)));
        var directionArrow = prevPressure - sTodayPressure > 0 ? '\u2193' : '\u2191';
        $(".div-diff")[0].setAttribute("style", "background-color: rgb(" + color + ")");
        $(".div-diff")[0].innerText = currentDate.toDateString() + " " + directionArrow;
      }
    });
    xml.open("get", sURL, true);
    xml.send();
}

var fnCalculateDifferences = function(aPressures) {
    var aReturn = [0];
    for (var i = 1; i < aPressures.length; i++) {
    	var a = aPressures[i-1].pressure;
    	var b = aPressures[i].pressure;
    	aReturn.push((a - b).toFixed(0));
    }
    console.log(aReturn);
    return aReturn;
};

var fnShowGraph = function() {
    if (navigator.geolocation) {
    	$("#cityForm").hide();
    	navigator.geolocation.getCurrentPosition(fnShowByGeolocation, fnHandleRejection);
    }
    else {
    	console.log("nope");
    }
};

var fnHandleRejection = function() {
    $("#cityForm").show();
    $('#city-button').click(function() {
    	var sCity = $("#cityText").val();
    	if (sCity && sCity !== "") {
    	    removeInvalidCity();
    	    fnShowByCity($("#cityText").val())
    	} else {
    	    setInvalidCity();
    	}
    });
};

var fnShowByCity = function(sCity) {
    var sURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + sCity + "&cnt=7&mode=json";
    var sPreviousDayURL = "http://api.openweathermap.org/data/2.5/history/city?q=" + sCity + "&type=hour&start=" + getPreviousDayDate() + "&cnt=1"
    fnGetForecastWithString(sURL, sPreviousDayURL);
};

function getPreviousDayDate() {
  var d = new Date().setHours(-24);
  return (d/1000).toFixed(0);
}

function colorForDiff(diff) {
    var red = 0.4588 + (1 - 0.4588)*diff/10;
    var green = 0.7020;
    var blue = 0.6078;

    if (diff < 5) {
    	green = green + (0.8 - green) * diff /4;
    	blue = blue + (0.6588 - blue) * diff/10;
        } else if (diff >=5) {
    	green = green - (green - 0.0235)*diff/20;
    	blue = blue - (blue - 0.1216) * diff/20;
    }
    return [(red * 255).toFixed(0), (green * 255).toFixed(0), (blue * 255).toFixed(0)];
};

function setInvalidCity() {
  $("#cityText").addClass("invalid-city");
  $("#cityText").attr("placeholder", "Enter valid city");
};

function removeInvalidCity() {
  $("#cityText").removeClass("invalid-city");
  $("#cityText").attr("placeholder", "Enter city");
}
