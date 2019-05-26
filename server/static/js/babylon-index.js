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
                addToAverage(experiences[i].model, e.position, e.rotation);
                //console.debug("Found match", experiences[i].id, e.name);
                ///copyVec(e.position, experiences[i].model.position);
                //console.log("Rotations", e.rotation, experiences[i].model.rotationQuaternion);
                ///copyVec(e.rotation, experiences[i].model.rotationQuaternion);
                //experiences[i].model.rotation.x += Math.PI / 2;
                //experiences[i].model.rotation.z += Math.PI / 2;
                //copyVec(e.scale, experiences[i].model.scaling);
                //experiences[i].scaling.set(e.scale, e.scale, e.scale);
                return;
            }
        }
        console.error("couldn't find model corresponding to the image target");
    });

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

function addToAverage(model, position, rotation) {
    console.log("Average Before:", model.averageTransform, "\nadding pos:", position, "\nadding rot:", rotation);
    //// Open For Increment ////
    // Position
    model.averageTransform.position.x *= model.averageTransform.numSamples;
    model.averageTransform.position.y *= model.averageTransform.numSamples;
    model.averageTransform.position.z *= model.averageTransform.numSamples;
    // Rotation
    model.averageTransform.rotation.x *= model.averageTransform.numSamples;
    model.averageTransform.rotation.y *= model.averageTransform.numSamples;
    model.averageTransform.rotation.z *= model.averageTransform.numSamples;
    // Increment
    model.averageTransform.numSamples++;

    //// Add ////
    addVector(position, model.averageTransform.position);
    addVector(rotation, model.averageTransform.rotation);

    //// Average ////
    // Position
    model.averageTransform.position.x /= model.averageTransform.numSamples;
    model.averageTransform.position.y /= model.averageTransform.numSamples;
    model.averageTransform.position.z /= model.averageTransform.numSamples;
    // Rotation
    model.averageTransform.rotation.x /= model.averageTransform.numSamples;
    model.averageTransform.rotation.y /= model.averageTransform.numSamples;
    model.averageTransform.rotation.z /= model.averageTransform.numSamples;

    //// Set ////
    model.position.x = model.averageTransform.position.x;
    model.position.y = model.averageTransform.position.y;
    model.position.z = model.averageTransform.position.z;
    model.rotation.x = model.averageTransform.rotation.x;
    model.rotation.y = model.averageTransform.rotation.y;
    model.rotation.z = model.averageTransform.rotation.z;

    console.log("Average After:", model.averageTransform);
}