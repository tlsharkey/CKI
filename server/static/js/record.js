// ======================================================================== //
//                      FOR RECORDING AN EXPERIENCE                         //
// ======================================================================== //

// When a marker is found, save the marker information

// Get the GPS location of the marker
var gpsReadings = [];

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById("lat").value = "ERROR";
        document.getElementById("long").value = "No GPS Access";
    }
}

function showPosition(position) {
    gpsReadings.push({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    });

    // Average the readings
    avg = {
        latitude: 0,
        longitude: 0
    }

    for (let i = 0; i < gpsReadings.length; i++) {
        avg.latitude += gpsReadings[i].latitude;
        avg.longitude += gpsReadings[i].longitude;
    }
    avg.latitude /= gpsReadings.length;
    avg.longitude /= gpsReadings.length;

    console.log("Average GPS location:", avg);
    document.getElementById("lat").value = avg.latitude;
    document.getElementById("long").value = avg.longitude;
}

// Begin Recording video

// Get 'END' event

// Send POST request