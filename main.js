
//==========STORE LATTITUDE / LONGITUDE VARIABLES


const latLon = {};


//==========FUNCTIONS TO CALCULATE MIDPOINT LOCATION


if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

if (typeof (Number.prototype.toDeg) === "undefined") {
    Number.prototype.toDeg = function () {
        return this * (180 / Math.PI);
    }
}

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


//==========FUNCTION TO FETCH THE CLOSEST MID-POINT THEATER
            

function initMap() {
                
    const locPoint = {lat: latLon.locLat, lng: latLon.locLon};
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 18, center: locPoint, zoomControl: false, mapTypeControl: false, streetViewControl: false, fullscreenControl: false});
                
}

//==========FUNCTION TO FETCH THE CLOSEST MID-POINT THEATER


function fetchTheater() {

    fetch(`https://api.foursquare.com/v2/venues/explore?v=20180323&limit=1&client_id=3HAKABTDGMV2KP5GQRRPIPENXJF2POJ01OVEGMKYQ4TLTYIL&client_secret=FHS1XXWEWLUPUEDHYWBFA3NG0HIVBEKLN1P5VRYHF2NDI2NJ&limit=5&ll=${latLon.midLat},${latLon.midLon}&categoryId=4bf58dd8d48988d180941735,4bf58dd8d48988d17e941735&radius=16090`)
    .then(response => response.json())
    .then(response => {

        if (response.response.groups[0].items.length > 0) {
            latLon.locLat = response.response.groups[0].items[0].venue.location.lat;
            latLon.locLon = response.response.groups[0].items[0].venue.location.lng;
            drawResults(response.response.groups[0].items[0].venue.name, response.response.groups[0].items[0].venue.location.formattedAddress[0], response.response.groups[0].items[0].venue.location.formattedAddress[1]);
        }

        else {
            drawNoResults();
        }

    })
    
}


//==========FUNCTION TO FETCH THE CLOSEST MID-POINT RESTAURANT


function fetchRestaurant() {
    
    fetch(`https://api.foursquare.com/v2/venues/explore?v=20180323&limit=1&client_id=3HAKABTDGMV2KP5GQRRPIPENXJF2POJ01OVEGMKYQ4TLTYIL&client_secret=FHS1XXWEWLUPUEDHYWBFA3NG0HIVBEKLN1P5VRYHF2NDI2NJ&limit=5&ll=${latLon.midLat},${latLon.midLon}&categoryId=4d4b7105d754a06374d81259&radius=16090`)
    .then(response => response.json())
    .then(response => {
   
        
        if (response.response.groups[0].items.length > 0) {
        
            latLon.locLat = response.response.groups[0].items[0].venue.location.lat;
            latLon.locLon = response.response.groups[0].items[0].venue.location.lng;
            drawResults(response.response.groups[0].items[0].venue.name, response.response.groups[0].items[0].venue.location.formattedAddress[0], response.response.groups[0].items[0].venue.location.formattedAddress[1]);

        }

        else {
            drawNoResults();
        }
    })

}


//==========FUNCTION TO FETCH THE CLOSEST COFFEE SHOP

function fetchCoffee() {
    fetch(`https://api.foursquare.com/v2/venues/explore?v=20180323&limit=1&client_id=3HAKABTDGMV2KP5GQRRPIPENXJF2POJ01OVEGMKYQ4TLTYIL&client_secret=FHS1XXWEWLUPUEDHYWBFA3NG0HIVBEKLN1P5VRYHF2NDI2NJ&limit=5&ll=${latLon.midLat},${latLon.midLon}&categoryId=4bf58dd8d48988d1e0931735&radius=16090`)
    .then(response => response.json())
    .then(response => {

        
        if (response.response.groups[0].items.length > 0) {
        
            latLon.locLat = response.response.groups[0].items[0].venue.location.lat;
            latLon.locLon = response.response.groups[0].items[0].venue.location.lng;
            drawResults(response.response.groups[0].items[0].venue.name, response.response.groups[0].items[0].venue.location.formattedAddress[0], response.response.groups[0].items[0].venue.location.formattedAddress[1]);

        }

        else {
            drawNoResults();
        }
    })
}

//==========FUNCTION TO FORMAT THE ADDRESS FOR THE GOOGLE MAPS API


function formatAddress(address) {
    return address.replace(/ /g, "+");
}


//====RESTART BUTTON EVENT LISTENER

function restartListener() {

    document.querySelector("#restart").addEventListener("click", (e) => {
        
        e.preventDefault();
            
        drawMain();

        submitListener();

        firstListener();

        secondListener();

        window.google = {};
                
                        
    })

}


//====SUBMIT BUTTON EVENT LISTENER

function submitListener() {

    document.querySelector("#submit").addEventListener("click", (e) => {
        e.preventDefault();
 
        middlePoint(latLon.firstLat, latLon.firstLon, latLon.secondLat, latLon.secondLon);
  
        

        
        if (document.querySelector("#activity").value === "movie") {
            fetchTheater();
        }
        else if (document.querySelector("#activity").value === "restaurant") {
            fetchRestaurant();
        }

        else if (document.querySelector("#activity").value === "coffee") {
            fetchCoffee();
        }

        
    })

}

//====FIRST ADDRESS LISTENER

function firstListener() {
    
    document.querySelector("#firstAddress").addEventListener("blur", (e) => {
        
        convertAddress(e.target.value)
        .then ((response) => {
            e.target.value = response.results[0].formatted_address;
            latLon.firstLat = response.results[0].geometry.location.lat;
  
            latLon.firstLon = response.results[0].geometry.location.lng;
    
        })
        
        toggleSubmit();

    })

}


//====SECOND ADDRESS LISTENER

function secondListener() {
    
    //====SECOND ADDRESS TEXT INPUT EVENT LISTENER

    document.querySelector("#secondAddress").addEventListener("blur", (e) => {
        
        convertAddress(e.target.value)
        .then ((response) => {
            e.target.value = response.results[0].formatted_address;
            latLon.secondLat = response.results[0].geometry.location.lat;
  
            latLon.secondLon = response.results[0].geometry.location.lng;
 
        })
        
        toggleSubmit();

    })

}

//==========FUNCTION TO CONVERT ADDRESS TO LONG / LAT


function convertAddress(address) {
    let formattedAddress = formatAddress(address);
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=AIzaSyDSnQDkrg2Qt3OeyQ5-93-NTIU3lEWOVLU`)
    .then(response => response.json())
    .then(response => {


        return response;
    })
}


//==========FUNCTION TO TOGGLE THE SUBMIT BUTTON TO ENABLED / DISABLED BASED ON UI CONDITIONS


function toggleSubmit() {
    
    if (document.querySelector("#firstAddress").value !== "" && document.querySelector("#secondAddress").value !== "" ) {

  
        document.querySelector("#submit").disabled = false;
    }

    else {
 
        document.querySelector("#submit").disabled = true;
    }
}

function loadMap() {
    
    if (document.querySelector("#googleMapsScript")) {

  
        
        document.querySelector("#googleMapsScript").parentNode.removeChild(document.querySelector("#googleMapsScript"));

    }

    const js_file = document.createElement("script");
    js_file.type = 'text/javascript';
    js_file.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDSnQDkrg2Qt3OeyQ5-93-NTIU3lEWOVLU&callback=initMap";
    js_file.id="googleMapsScript";
    document.getElementsByTagName('head')[0].appendChild(js_file);

}


//==========FUNCTION TO DRAW MAIN PAGE

function drawMain() {
    document.querySelector(".content").innerHTML = `                
        <p>Find a fun activity between two places!</p>
        <form>
            <fieldset>
                <p class="lowerMargin"><label for="firstAddress">Your Address</label></p>
                <p><input type="text" id="firstAddress" class="formFields" placeholder="3312 Park Street Dallas, TX 78654"></p>
                <p class="lowerMargin"><label for="secondAddress">Their Address</label></p>
                <p><input type="text" id="secondAddress" class="formFields" placeholder="1001 Smith Lane Plano, TX 76543"></p>
                <p class="lowerMargin"><label for="activity">I want to...</label></p>
                <p>
                    <select id="activity" class="formFields">
                        <option value="movie">See A Movie</option>
                        <option value="restaurant">Eat At A Restaurant</option>
                        <option value="coffee">Grab A Coffee</option>
                    </select>
                </p>
                <p><button type="submit" id="submit" class="button">Submit</button></p>
            </fieldset>
        </form>`
}


//==========FUNCTION TO DRAW RESULTS PAGE

function drawResults(name, addressStreet, addressCity) {
    document.querySelector(".content").innerHTML = `                
        <h2>You Should Meet At...</h2>
        <div class="center">
            <h3 class="lowerMargin">${name}</h3>
            <p class="lowerMargin">${addressStreet}</p>
            <p class="lowerMargin">${addressCity}</p>
            <div id="map"></div>
        </div>
        <p><form><button type="submit" class="button" id="restart">Search Again</button></p>
        `
    loadMap();

    restartListener();
            
}

//==========FUNCTION TO DRAW NO RESULTS PAGE

function drawNoResults() {
    document.querySelector(".content").innerHTML = `                
        <h2>Well, that's a bummer...</h2>
        <div class="center">
            <p>Unfortunately there is nothing found within 10 miles of your mid point</p>
            <img src="img/field.jpg" id="field">
        </div>
        <p><form><button type="submit" class="button" id="restart">Search Again</button></p>
        `

        restartListener();
}


//==========WAIT UNTIL DOM HAS LOADED THEN CALL REQUIRED FUNCTIONS


window.addEventListener("DOMContentLoaded", (e) => {
    
    drawMain();
    
    toggleSubmit();

    submitListener();

    firstListener();

    secondListener();

});