var light;
var experiences = [];



// gets proper host
var host = location.origin.replace(/^http/, 'ws');
host += "/cnxshun";
var ws = new WebSocket(host);
var deb;

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
                        width: 5,
                        height: 5,
                        scaling: 1920 / 1080 * 3
                    }, scene);
                    experiences[i].model["averageTransform"] = {
                        position: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        rotation: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        numSamples: 0,
                        standardDev: {
                            position: 0,
                            rotation: 0
                        }
                    }
                    experiences[i].model["averageSubtransform"] = {
                        position: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        rotation: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        numSamples: 0,
                        standardDev: {
                            position: 0,
                            rotation: 0
                        }
                    }

                    let mat = new BABYLON.StandardMaterial("mat", scene);
                    if (experiences[i].experience.startsWith("video")) {
                        mat.diffuseTexture = new BABYLON.VideoTexture("video", [experiences[i].experience], scene, true);
                        mat.diffuseTexture.video.loop = false;
                        mat.diffuseTexture.video.autoplay = false;
                        experiences[i].model.material = mat;
                    } else {
                        mat.diffuseTexture = new BABYLON.Texture("assets/sound.png", scene);
                        mat.specularColor = new BABYLON.Color3(0, 0, 0);
                        experiences[i].model.material = mat;
                        let sound = new BABYLON.Sound("sound", experiences[i].experience, scene, null, {
                            loop: false,
                            autoplay: false
                        });
                        sound.attachToMesh(experiences[i].model);
                        experiences[i].model["experienceSound"] = sound;
                    }
                }

                // Setup click handling
                window.addEventListener("click", function(e) {
                    let pick = scene.pick(e.clientX, e.clientY);
                    if (pick.pickedMesh) {
                        if (pick.pickedMesh.material.diffuseTexture) {
                            //if (pick.pickedMesh.material.diffuseTexture)
                            //console.log("Type of texture", pick.pickedMesh.material.diffuseTexture.video);
                            if (pick.pickedMesh.material.diffuseTexture.video) {
                                playPauseVideo(pick.pickedMesh.material.diffuseTexture.video);
                            } else {
                                console.log("This is audio", pick.pickedMesh);
                                playPauseAudio(pick.pickedMesh.experienceSound);
                            }
                        }
                    }
                })
                break;
            default:
                console.warn("Unknown Message");
        }
    }
}

function loadExperiences() {
    try {
        ws.send(JSON.stringify({
            type: "getExperiences"
        }));
        console.log("Sent getExperiences message.");
    } catch (e) {
        console.log("Waiting to send getExperiences message...");
        setTimeout(loadExperiences, 500);
    }
}

function makeGoodName(name) {
    name = name.split("/").join("-");
    name = name.split(".").join("_");
    return name;
}

function playPauseVideo(video) {
    if (video.paused || video.ended) {
        video.play();
    } else {
        video.pause();
    }
}

function playPauseAudio(audio) {
    console.log("Audio", audio);
    deb = audio;
    if (audio.isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
}

setTimeout(loadExperiences, 1000);