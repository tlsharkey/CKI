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
        document.getElementById("location").innerHTML = "ERROR, No GPS Access";
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
    //document.getElementById("location").innerHTML = avg.latitude + " x " + avg.longitude;
    document.getElementById("getLocationButton").innerHTML = "Your GPS Coords:<br>" + avg.latitude + " x " + avg.longitude;
    if ($("#lat").val() && $("#long").val() && $("input[type=text][name=sticker]").val()) {
        console.log("Showing Submit Button", $("#lat").val(), $("#long").val(), $("#sticker").val());
        $($("#sticker")[0].parentElement).find("div.submit").css("display", "block");
    }
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

        if ($("#lat").val() && $("#long").val() && $("input[type=text][name=sticker]").val()) {
            console.log("Showing Submit Button", $("#lat").val(), $("#long").val(), $("#sticker").val());
            $($("#sticker")[0].parentElement).find("div.submit").css("display", "block");
        }
    });
}

function makePostRequest() {
    var form = document.getElementById("experienceRecording");
    var file = $("input[name=video]")[0].files[0];
    console.log("Data to POST", form, file);

    //// Get Form Data
    var formData = new FormData(form);
    formData.append("video", $("input[name=video]")[0].files[0]);
    console.log("form data", formData);

    //// Make POST Request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/uploadExperience', true);
    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(formData);

    //// Keep track of upload progress
    let fileSize = file.size;
    $("progress").max = fileSize;
    $("progress").value = 0;

    xhr.upload.addEventListener("progress", function(evt) {
        if (evt.lengthComputable) {
            console.log("add upload event-listener" + evt.loaded + "/" + evt.total);
            $("progress").value = evt.loaded;
        }
    }, false);

    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            onUploadComplete();
        }
    }

    cleanUpSecondPost();
}

function onUploadComplete() {
    console.log("Upload Completed");
}