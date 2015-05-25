function getForecastWithString (sURL, sPrevURL) {
    var promise = new Promise (function(resolve, reject) {
        requestOkText(sURL).then(function (responseText) {
            var oJSON = JSON.parse(responseText),
                i,
                aDiffs = calculateDifferences(oJSON.list),
                currentDate = new Date(),
                directionArrow,
                aDates = getDatesFromResponse(oJSON.list),
                finalArray = [];
            for (i = 0; i < aDiffs.length; i = i + 1) {
                directionArrow = aDiffs[i] > 0 ? '\u2193' : '\u2191';
                finalArray.push({
                    date: new Date(aDates[i] * 1000).toDateString(),
                    arrow: directionArrow,
                    color: "rgb(" + colorForDiff(Math.abs(aDiffs[i])) + ")",
                    changeValue: aDiffs[i]
                });
            }
            resolve([oJSON.city.name, finalArray]);
        }).catch(function (error) {
            console.log("Error while getting data: " + error);
            reject(error);
        });
    });
    return promise;
}

export function showByCity(sCity) {
    var sURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + sCity + "&cnt=7&mode=json";
    return getForecastWithString(sURL);
}

export function showGraph() {
    var p2 = new Promise(function (resolve, reject) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                showByGeolocation,
                handleRejection,
                {
                    enableHighAccuracy: true,
                    timeout : 5000
                }
            );
        } else {
            handleRejection();
        }

        function handleRejection() {
            console.log('rejected geolocation');
            showByCity("Kiev");
            reject("Geolocation was rejected by browser");
        }

        function showByGeolocation(geolocation) {
            var sURL = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + geolocation.coords.latitude + "&lon=" + geolocation.coords.longitude + "&cnt=7&mode=json";
            console.log("used url: " + sURL);
            resolve(getForecastWithString(sURL));
        }
    });
    return p2;
}

function requestOkText(url) {
    var request = new XMLHttpRequest();
    var p1 = new Promise(function(resolve, reject) {
        function onload() {
            if (request.status === 200) {
                resolve(request.responseText);
            } else {
                reject(new Error("Status code was " + request.status));
            }
        }
        function onerror() {
            reject(new Error("Can't XHR " + JSON.stringify(url)));
        }
        request.open("GET", url, true);
        request.onload = onload;
        request.onerror = onerror;
        request.onprogress = onprogress;
        request.send();
    });
    return p1;
}

function colorForDiff(diff) {
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

function calculateDifferences(aPressures) {
    var aReturn = [0], i, a, b;
    for (i = 1; i < aPressures.length; i = i + 1) {
        a = aPressures[i - 1].pressure;
        b = aPressures[i].pressure;
        aReturn.push((a - b).toFixed(0));
    }
    return aReturn;
}

function getDatesFromResponse(oResponse) {
    var a = [], i = 0;
    for (i = 0; i < oResponse.length; i = i + 1) {
        a.push(oResponse[i].dt);
    }
    return a;
}