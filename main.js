
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


function fetchTheater() {
    console.log("Fetching Theaters");
    fetch(`https://api.foursquare.com/v2/venues/explore?v=20180323&limit=1&client_id=3HAKABTDGMV2KP5GQRRPIPENXJF2POJ01OVEGMKYQ4TLTYIL&client_secret=FHS1XXWEWLUPUEDHYWBFA3NG0HIVBEKLN1P5VRYHF2NDI2NJ&limit=5&ll=${latLon.midLat},${latLon.midLon}&categoryId=4bf58dd8d48988d17f941735&radius=5000`)
    .then(response => response.json())
    .then(response => {
        console.log(response);
       drawResults(response.response.groups[0].items[0].venue.name, response.response.groups[0].items[0].venue.location.formattedAddress[0] + " " + response.response.groups[0].items[0].venue.location.formattedAddress[1]);
    })
    
}


//==========FUNCTION TO FETCH THE CLOSEST MID-POINT RESTAURANT


function fetchRestaurant() {
    const options = {
        headers : new Headers({
            "user-key": "e0e7b415b5ce59c3c9d0103f1b7ef4f6"
        })
    };
    console.log("Fetching Restaurants");
    fetch(`https://developers.zomato.com/api/v2.1/search?lat=${latLon.midLat}&lon=${latLon.midLon}&radius=5000&count=5`, options)
    .then(response => response.json())
    .then (response => {
        console.log(response);
        drawResults(response.restaurants[0].restaurant.name, response.restaurants[0].restaurant.location.address, response.restaurants[0].restaurant.phone_numbers)
    })
}


//==========FUNCTION TO FETCH THE CLOSEST COFFEE SHOP

function fetchCoffee() {
    fetch(`https://api.foursquare.com/v2/venues/explore?v=20180323&limit=1&client_id=3HAKABTDGMV2KP5GQRRPIPENXJF2POJ01OVEGMKYQ4TLTYIL&client_secret=FHS1XXWEWLUPUEDHYWBFA3NG0HIVBEKLN1P5VRYHF2NDI2NJ&limit=5&ll=${latLon.midLat},${latLon.midLon}&categoryId=4bf58dd8d48988d1e0931735&radius=2000`)
    .then(response => response.json())
    .then(response => {
        console.log(response);
       drawResults(response.response.groups[0].items[0].venue.name, response.response.groups[0].items[0].venue.location.formattedAddress[0] + " " + response.response.groups[0].items[0].venue.location.formattedAddress[1]);
    })
}

//==========FUNCTION TO FORMAT THE ADDRESS FOR THE GOOGLE MAPS API


function formatAddress(address) {
    return address.replace(/ /g, "+");
}


//==========FUNCTION TO CONVERT ADDRESS TO LONG / LAT


function convertAddress(address) {
    let formattedAddress = formatAddress(address);
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=AIzaSyDSnQDkrg2Qt3OeyQ5-93-NTIU3lEWOVLU`)
    .then(response => response.json())
    .then(response => {

        console.log(response);
        return response;
    })
}


//==========FUNCTION TO TOGGLE THE SUBMIT BUTTON TO ENABLED / DISABLED BASED ON UI CONDITIONS


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


//==========FUNCTION TO DRAW MAIN PAGE

function drawMain() {
    document.querySelector("#content").innerHTML = `                
        <p>This application helps you find an activity midway between two addresses.</p>
        <form>
            <p><label for="firstAddress">Your Location</label></p>
            <p><input type="text" id="firstAddress" class="formFields"></p>
            <p><label for="secondAddress">Their Location</label></p>
            <p><input type="text" id="secondAddress" class="formFields"></p>
            <p><label for="activity">I want to...</label></p>
            <p>
                <select id="activity" class="formFields">
                    <option value="movie">See A Movie</option>
                    <option value="restaurant">Eat At A Restaurant</option>
                    <option value="coffee">Grab A Coffee</option>
                </select>
            </p>
            <p><button type="submit" id="submit" class="formFields">Submit</button></p>
        </form>`
}


//==========FUNCTION TO DRAW RESULTS PAGE

function drawResults(name, address, number) {
    document.querySelector("#content").innerHTML = `                
        <h2>You Should Meet At...</h2>
        <p>${name}</p>
        <p>${address}</p>
        <p>${number}</p>
        <p><form><button type="submit" class="formFields">Search Again</button></p>`
}


//==========WAIT UNTIL DOM HAS LOADED THEN CALL REQUIRED FUNCTIONS


window.addEventListener("DOMContentLoaded", (e) => {
    
    drawMain();
    
    toggleSubmit();
    
    //====SUBMIT BUTTON EVENT LISTENER

    document.querySelector("#submit").addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Submit Button Clicked!");
        middlePoint(latLon.firstLat, latLon.firstLon, latLon.secondLat, latLon.secondLon);
        console.log("Middle Point Coordinates are " + latLon.midLat + ", " + latLon.midLon);
        
        console.log("The value selected in the dropdown is " + document.querySelector("#activity").value);
        
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
    
    //====FIRST ADDRESS TEXT INPUT EVENT LISTENER
    
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

    //====SECOND ADDRESS TEXT INPUT EVENT LISTENER

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