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

// Visuals
function cleanUpFirstPost(ev) {
    document.getElementById("experienceData").style.display = "none";
    document.getElementById("experienceRecording").style.display = "block";
}

function cleanUpSecondPost(ev) {
    document.getElementById("experienceRecording").style.display = "none";
    document.getElementById("loading").style.display = "block";
}

function init() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("experienceRecording").style.display = "none";

    document.getElementById("sticker").addEventListener("click", function(ev) {
        let select = ev.target;
        let opts = $("#options")[0];

        $(opts).css("top",
            parseInt($("#sticker").position().top) +
            parseInt($("#sticker").css("height")) + 20
        );

        if (opts.style.display === "none" || opts.style.display === "") {
            opts.style.display = "block";

            // Set options to be clickable
            $("#options div.option").click(function(ev) {
                console.log($(ev.target).prop("tagName"));
                let choice;
                if ($(ev.target).prop("tagName") === "IMG") {
                    choice = $(ev.target)[0].src.split("targets/")[1];
                } else {
                    choice = $(ev.target)[0].childNodes[0].src.split("targets/")[1];
                }
                $("#experienceData input[type=text][name=sticker]").val(choice);
            });
        } else {
            opts.style.display = "none";
        }
    });
}