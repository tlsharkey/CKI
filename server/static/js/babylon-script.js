var light;
var experiences = [];



// gets proper host
var host = location.origin.replace(/^http/, 'ws');
host += "/cnxshun";
var ws = new WebSocket(host);

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
            case "experiences":
                console.log("Got experiences", msg);
                for (let i = 0; i < msg.experiences.length; i++) {
                    experiences.push({
                        id: msg.experiences[i].id,
                        model: null,
                        experience: msg.experiences[i].experience,
                    });
                }

                for (let i = 0; i < experiences.length; i++) {
                    experiences[i].model = BABYLON.MeshBuilder.CreatePlane("plane", {
                        width: 1,
                        height: 1,
                        scaling: 1920 / 1080 * 3
                    }, scene);

                    let mat = new BABYLON.StandardMaterial("mat", scene);
                    mat.diffuseTexture = new BABYLON.VideoTexture("video", [experiences[i].experience], scene, true);
                    experiences[i].model.material = mat;
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

function makeGoodName(name) {
    name = name.split("/").join("-");
    name = name.split(".").join("_");
    return name;
}

setTimeout(loadExperiences, 1000);