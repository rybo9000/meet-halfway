const latLon = {};

//-- Define radius function
if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

//-- Define degrees function
if (typeof (Number.prototype.toDeg) === "undefined") {
    Number.prototype.toDeg = function () {
        return this * (180 / Math.PI);
    }
}

// function to calculate middle point
function middlePoint(lat1, lng1, lat2, lng2) {
	
    //-- Longitude difference
    var dLng = (lng2 - lng1).toRad();

    //-- Convert to radians
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();
    lng1 = lng1.toRad();

    var bX = Math.cos(lat2) * Math.cos(dLng);
    var bY = Math.cos(lat2) * Math.sin(dLng);
    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
    var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

    latLon.midLat = lat3.toDeg();
    latLon.midLon = lng3.toDeg();
}


function fetchTheater() {
    const options = {
        headers: new Headers({
            "x-api-key": "PqLvltIKfy2W4gCQQAcVl2Lv2aUnUxEHIsywkNVh",
            "Territory": "US",
            "Authorization": "Basic VEhJTl8zOlpSazRHd05ac1NIMQ==",
            "geolocation": `${latLon.midLat};${latLon.midLon}`,
            "Access-Control-Allow-Origin": "no-cors"
        })
    };
    console.log("Fetching Theaters");
    fetch(`https://api-gate2.movieglu.com/cinemasNearby/?n=5`, options)
    .then(response => response.json())
    .then(response => console.log(response))
}

function formatAddress(address) {
    return address.replace(/ /g, "+");
}

function convertAddress(address) {
    let formattedAddress = formatAddress(address);
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=AIzaSyDSnQDkrg2Qt3OeyQ5-93-NTIU3lEWOVLU`)
    .then(response => response.json())
    .then(response => {

        console.log(response);
        return response;
    })
}

function toggleSubmit() {
    
    if (document.querySelector("#firstAddress").value !== "" && document.querySelector("#secondAddress").value !== "" ) {

        console.log("Submit Button Enabled");
        document.querySelector("#submit").disabled = false;
    }

    else {
        console.log("Submit Button Disabled");
        document.querySelector("#submit").disabled = true;
    }
}

window.addEventListener("DOMContentLoaded", (e) => {
    
    toggleSubmit();
    
    // submit button event listener
    document.querySelector("#submit").addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Submit Button Clicked!");
        middlePoint(latLon.firstLat, latLon.firstLon, latLon.secondLat, latLon.secondLon);
        console.log("Middle Point Coordinates are " + latLon.midLat + ", " + latLon.midLon);
        if (document.querySelector("#submit").value = "movie") {
            fetchTheater();
        }
    })

    // firstAddress event listener onblur
    document.querySelector("#firstAddress").addEventListener("blur", (e) => {
        
        convertAddress(e.target.value)
        .then ((response) => {
            e.target.value = response.results[0].formatted_address;
            latLon.firstLat = response.results[0].geometry.location.lat;
            console.log("First lattitude is " + latLon.firstLat);
            latLon.firstLon = response.results[0].geometry.location.lng;
            console.log("First longitude is " + latLon.firstLon);
        })
        toggleSubmit();

    })

    // secondAddress event listener onblur
    document.querySelector("#secondAddress").addEventListener("blur", (e) => {
        
        convertAddress(e.target.value)
        .then ((response) => {
            e.target.value = response.results[0].formatted_address;
            latLon.secondLat = response.results[0].geometry.location.lat;
            console.log("Second lattitude is " + latLon.secondLat);
            latLon.secondLon = response.results[0].geometry.location.lng;
            console.log("Second longitude is " + latLon.secondLon);
        })
        toggleSubmit();

    })
});