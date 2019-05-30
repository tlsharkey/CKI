var actionManager;

let surface, engine, scene, camera

// Populates some object into an XR scene and sets the initial camera position.
const initXrScene = ({
    scene,
    camera
}) => {
    console.log('initXrScene')

    const directionalLight = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 1), scene)
    directionalLight.intensity = 1.0

    const ground = BABYLON.Mesh.CreatePlane('ground', 100, scene)
    ground.rotation.x = Math.PI / 2
    ground.material = new BABYLON.StandardMaterial("groundMaterial", scene)
    ground.material.alpha = 0
    surface = ground

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position = new BABYLON.Vector3(0, 3, 5)
}


const startScene = () => {
    const canvas = document.getElementById('renderCanvas')

    engine = new BABYLON.Engine(canvas, true, {
        stencil: true,
        preserveDrawingBuffer: true
    })
    engine.enableOfflineSupport = false

    scene = new BABYLON.Scene(engine)
    camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, 0), scene)

    initXrScene({
        scene,
        camera
    }) // Add objects to the scene and set starting camera position.

    // Connect the camera to the XR engine and show camera feed
    camera.addBehavior(XR.Babylonjs.xrCameraBehavior())

    light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    engine.runRenderLoop(() => {
        // Enable TWEEN animations.
        TWEEN.update(performance.now())
        scene.render()
        //console.log(camera.position);
    })

    window.addEventListener('resize', () => {
        engine.resize()
    });

    scene.onXrImageUpdatedObservable.add(e => {
        //console.log("Got Image Target", e);
        for (let i = 0; i < experiences.length; i++) {
            if (experiences[i].id === e.name) {
                addToAverage(experiences[i].model, experiences[i].model.averageTransform, e.position, e.rotation);
                addToAverage(experiences[i].model, experiences[i].model.averageSubtransform, e.position, e.rotation);

                let d_position = Math.abs(getDisplacement(
                    experiences[i].model.averageSubtransform.position,
                    experiences[i].model.averageTransform.position
                ));

                let d_rotation = Math.abs(getDisplacement(
                    experiences[i].model.averageSubtransform.rotation,
                    experiences[i].model.averageSubtransform.rotation
                ));


                if (experiences[i].model.averageSubtransform.numSamples > 5) {
                    //console.log("number of samples", experiences[i].model.averageSubtransform.numSamples);
                    if (d_position > 1) {
                        // Reset Position
                        console.log("Resetting Position. deltas:", d_position, d_rotation);
                        experiences[i].model.averageTransform.position = experiences[i].model.averageSubtransform.position;
                    }

                    if (d_rotation > 1) {
                        // Reset Rotation
                        console.log("Resetting Rotation. deltas:", d_position, d_rotation);
                        experiences[i].model.averageTransform.rotation = experiences[i].model.averageSubtransform.rotation;
                    }
                }
                return;
            }
        }
        console.error("couldn't find model corresponding to the image target");
    });

    scene.onXrImageFoundObservable.add(e => {
        for (let i = 0; i < experiences.length; i++) {
            if (experiences[i].id === e.name) {
                experiences[i].model.averageSubtransform = {
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
                return;
            }
        }
    })

    actionManager = new BABYLON.ActionManager(scene);
}

const onxrloaded = () => {
    XR.addCameraPipelineModules([ // Add camera pipeline modules.
    XRExtras.AlmostThere.pipelineModule(), // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.
  ])

    startScene()
}


// Show loading screen before the full XR library has been loaded.
const load = () => {
    XRExtras.Loading.showLoading({
        onxrloaded
    })
}
window.onload = () => {
    window.XRExtras ? load() : window.addEventListener('xrextrasloaded', load)
}

function copyVec(from, to) {
    if (to === null) {
        to = {
            x: null,
            y: null,
            z: null
        };
    }
    to.x = from.x;
    to.y = from.y;
    to.z = from.z;
    if (from.w) {
        to['w'] = from.w;
    }
}

function addVector(vector, addTo) {
    addTo.x += vector.x;
    addTo.y += vector.y;
    addTo.z += vector.z;
}

function multVector(vector, multTo) {
    multTo.x *= vector.x;
    multTo.y *= vector.y;
    multTo.z *= vector.z;
}

function divideVector(vector, divTo) {
    divTo.x /= vector.x;
    divTo.y /= vector.y;
    divTo.z /= vector.z;
}

function addToAverage(model, average, position, rotation) {
    //// Open For Increment ////
    // Position
    average.position.x *= average.numSamples;
    average.position.y *= average.numSamples;
    average.position.z *= average.numSamples;
    // Rotation
    average.rotation.x *= average.numSamples;
    average.rotation.y *= average.numSamples;
    average.rotation.z *= average.numSamples;
    // Increment
    average.numSamples++;

    //// Add ////
    addVector(position, average.position);
    addVector(rotation, average.rotation);

    //// Average ////
    // Position
    average.position.x /= average.numSamples;
    average.position.y /= average.numSamples;
    average.position.z /= average.numSamples;
    // Rotation
    average.rotation.x /= average.numSamples;
    average.rotation.y /= average.numSamples;
    average.rotation.z /= average.numSamples;

    //// Set ////
    model.position.x = average.position.x;
    model.position.y = average.position.y;
    model.position.z = average.position.z;
    model.rotation.x = average.rotation.x;
    model.rotation.y = average.rotation.y;
    model.rotation.z = average.rotation.z;
}

function getDisplacement(vec1, vec2) {
    let mag1 = vectorMagnitude(vec1);
    let mag2 = vectorMagnitude(vec2);
    return mag2 - mag1;
}

function vectorMagnitude(vector) {
    let mag = Math.sqrt(
        Math.pow(vector.x, 2) +
        Math.pow(vector.y, 2) +
        Math.pow(vector.z, 2)
    )
    return mag;
}