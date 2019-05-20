// gets proper host
var host = location.origin.replace(/^http/, 'ws');
host += "/cnxshun";
var ws = new WebSocket(host);
var wsConnected = false;

var experiences;
var pageType = location.href.split("/");
pageType = pageType[pageType.length - 1];

ws.onconnection = function(event) {
    console.log('connected!');
}

ws.onmessage = function(event) {
    var message = event.data;
    let msg;
    try {
        msg = JSON.parse(message);
    } catch (error) {
        return console.log('Non JSON message received!', message);
    }

    if (msg && 'type' in msg) {
        switch (msg.type) {
            case "connected":
                wsConnected = true;
                switch (pageType) {
                    case "map":
                    case "viewer":
                        loadExperiences();
                        break;
                    default:
                        console.warn("Not Doing anything when websocket connects for", pageType);
                }
                break;
            case "experiences":
                console.log("Got experiences", msg);
                experiences = msg.experiences;
                switch (pageType) {
                    case "map":
                        placePins();
                        break;
                    case "viewer":
                        parseExperiences();
                        break;
                    default:
                        console.warn("Not doing anything with experiences for", pageType);
                }
                break;
            default:
                console.warn("Unknown Message");
        }
    }
}

function loadExperiences() {
    console.log("Sending getExperiences request");
    ws.send(JSON.stringify({
        type: "getExperiences"
    }));
}
var deb;

function parseExperiences() {
    return;
    let assets = document.getElementById("aframeAssets");
    let scene = document.getElementById("scene");

    for (let i = 0; i < experiences.length; i++) {
        let experience = experiences[i];

        //// Create Assets
        // Target
        let target = document.createElement("img");
        target.setAttribute("id", makeGoodName(experience.target));
        target.setAttribute("src", "assets/targets/" + experience.target);
        // Experience
        let content = document.createElement("video");
        content.setAttribute("id", makeGoodName(experience.experience));
        content.setAttribute("autoplay", "");
        content.setAttribute("crossorigin", "anonymous");
        content.setAttribute("loop", "true");
        content.setAttribute("src", experience.experience);
        // Add to HTML
        assets.appendChild(target);
        assets.appendChild(content);
        console.debug("Added target", target, "and content", content, "to assets", assets);

        //// Create A-Frame Entity for marker
        let entity = document.createElement("a-entity");
        deb = entity;
        // entity.setAttribute("image-target", "name: " + makeGoodName(experience.target));
        // entity.setAttribute("xrextras-play-video", "video: #" + makeGoodName(experience.experience) + "; thumb: #" + makeGoodName(experience.target) + "; canstop: true");
        // entity.setAttribute("geometry", "primitive: plane; height:3; width:3");

        $(entity)[0].setAttribute('image-target', {
            name: makeGoodName(experience.target)
        });
        $(entity)[0].setAttribute("xrextras-play-video", {
            video: "#" + makeGoodName(experience.experience),
            thumb: "#" + makeGoodName(experience.target),
            canstop: true
        });
        $(entity)[0].setAttribute("geometry", {
            primitive: "plane",
            height: 3,
            width: 3
        });

        // Add to HTML
        scene.appendChild(entity);
        console.debug("Added entity", entity, "to scene", scene);

        console.log("Added", experience);
    }
    console.log("Added experiences");
    //document.getElementsByTagName("body")[0].setAttribute("onload", "");
    //document.getElementsByTagName("body")[0].contentWindow.location.reload(true);
}

function makeGoodName(name) {
    name = name.split("/").join("-");
    name = name.split(".").join("_");
    return name;
}

function placePins() {
    if (mapSetup && wsConnected) {
        for (let i = 0; i < experiences.length; i++) {
            let location = new google.maps.LatLng(experiences[i].location.latitude, experiences[i].location.longitude);
            placeMarker(location, "assets/targets/" + experiences[i].thumbnail, experiences[i].experience);
        }



        // let markerCluster = new MarkerClusterer(map, markers, {
        //     imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        // });

    } else {
        console.debug("Map is" + ((mapSetup) ? "" : "n't"), "ready. Websocket is" + ((wsConnected) ? "" : "n't"), "ready.")
    }
}