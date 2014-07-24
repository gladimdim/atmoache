var app = angular.module("atmoapp", []);

app.controller("PressureController", function($scope) {
    $scope.pressures = [];

    $scope.info = {
        cityName: null
    };
    $scope.showCity = false;

    $scope.getAtmoClicked = function() {
        console.log($scope.cityName);
        $scope.pressures = [];
        if ($scope.cityName && $scope.cityName !== "") {
            showByCity($scope.cityName);
        }
        else  {

        }
    };

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
    };

    function calculateDifferences(aPressures) {
        "use strict";
        var aReturn = [0], i, a, b;
        for (i = 1; i < aPressures.length; i = i + 1) {
            a = aPressures[i - 1].pressure;
            b = aPressures[i].pressure;
            aReturn.push((a - b).toFixed(0));
        }
        return aReturn;
    };

    function getDatesFromResponse(oResponse) {
        var a = [], i = 0;

        for (i = 0; i < oResponse.length; i = i + 1) {
            a.push(oResponse[i].dt);
        }
        return a;
    };

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
    };

    function getForecastWithString(sURL, sPrevURL) {
        "use strict";
        requestOkText(sURL).then(function (responseText) {
            var oJSON = JSON.parse(responseText),
                i,
                aDiffs,
                currentDate = new Date(),
                directionArrow,
                color,
                aDates;
            if (!oJSON.hasOwnProperty("city")) {
                setInvalidCity();
                return;
            }
            $scope.$apply(function() {
                $scope.info.cityName = oJSON.city.name;
            });
            aDiffs = calculateDifferences(oJSON.list);
            aDates = getDatesFromResponse(oJSON.list);
            for (i = 0; i < aDiffs.length; i = i + 1) {
                directionArrow = aDiffs[i] > 0 ? '\u2193' : '\u2191';
                color = colorForDiff(Math.abs(aDiffs[i]));
                $scope.$apply(function() {
                    $scope.pressures.push({
                        text: aDates[i] * 1000,
                        up: directionArrow,
                        colorStyle: {
                            'background-color': "rgb(" + color + ")"
                        }
                    });
                });
            //    $("#pressure").append("<div class='div-diff' style='background-color: rgb( " + color + ");'>" + currentDate.toDateString() + " " + directionArrow + "</div>");
            }
        }).catch(function (error) {
            console.log("Error while getting data: " + error);
        }).finally(function () {
            //hideProgressBar();
        }).done();
    };

    function showByGeolocation(geolocation) {
        "use strict";
        var sURL = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + geolocation.coords.latitude + "&lon=" + geolocation.coords.longitude + "&cnt=7&mode=json";
        getForecastWithString(sURL);
    };

    function handleRejection() {
        "use strict";
        $scope.$apply(function() {
            $scope.showCity = true;
        });
    };

    function showGraph() {
        "use strict";
        /*global navigator */
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showByGeolocation,
                handleRejection,
                {
                    enableHighAccuracy: true,
                    timeout : 5000
                }
            );
        } else {
            console.log("nope");
        }
    };

    function showByCity(sCity) {
        "use strict";
        var sURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + sCity + "&cnt=7&mode=json";
        getForecastWithString(sURL);
    };

    showGraph();
});
