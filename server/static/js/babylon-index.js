const modelRootURL = 'assets/' // Directory where 3D model lives
const modelFile = 'tree.glb' // 3D model to spawn at tap
const startScale = new BABYLON.Vector3(0.01, 0.01, 0.01) // Initial scale value for our model
const endScale = new BABYLON.Vector3(0.05, 0.05, 0.05) // Ending scale value for our model
const animationMillis = 750 // Animate over 0.75 seconds

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

const placeObjectTouchHandler = (e) => {
    // console.log('placeObjectTouchHandler')
    // Call XrController.recenter() when the canvas is tapped with two fingers. This resets the
    // AR camera to the position specified by XrController.updateCameraProjectionMatrix() above.
    if (e.touches.length == 2) {
        XR.XrController.recenter()
    }

    if (e.touches.length > 2) {
        return
    }

    // If the canvas is tapped with one finger and hits the "surface", spawn an object.

    const pickResult = scene.pick(e.touches[0].clientX, e.touches[0].clientY)
    if (pickResult.hit && pickResult.pickedMesh == surface) {

        const gltf = BABYLON.SceneLoader.LoadAssetContainer(
            modelRootURL,
            modelFile,
            scene,
            function(container) { // onSuccess
                const scale = Object.assign({}, startScale)
                const yRot = Math.random() * 360
                for (i = 0; i < container.meshes.length; i++) {
                    container.meshes[i]._position.x = pickResult.pickedPoint.x
                    container.meshes[i]._position.z = pickResult.pickedPoint.z
                    container.meshes[i]._rotation.y = yRot
                    container.meshes[i]._scaling.x = scale.x
                    container.meshes[i]._scaling.y = scale.y
                    container.meshes[i]._scaling.z = scale.z
                }
                // Adds all elements to the scene
                container.addAllToScene()

                new TWEEN.Tween(scale)
                    .to(endScale, animationMillis)
                    .easing(TWEEN.Easing.Elastic.Out) // Use an easing function to make the animation smooth.
                    .onUpdate(() => {
                        for (i = 0; i < container.meshes.length; i++) {
                            container.meshes[i]._scaling.x = scale.x
                            container.meshes[i]._scaling.y = scale.y
                            container.meshes[i]._scaling.z = scale.z
                        }
                    })
                    .start() // Start the tween immediately.
            },
            function(xhr) { //onProgress
                console.log(`${(xhr.loaded / xhr.total * 100 )}% loaded`)
            },
            function(error) { //onError
                console.log('Error loading model')
            },
        )
    }
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
    //canvas.addEventListener('touchstart', placeObjectTouchHandler, true) // Add touch listener.

    light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    for (let i = 0; i < experiences.length; i++) {
        experiences[i].model = BABYLON.MeshBuilder.CreatePlane("plane", {
            width: 1,
            height: 1,
            scaling: 1920 / 1080
        }, scene);

        let mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseTexture = new BABYLON.VideoTexture("video", ["video/signs.mp4"], scene, true);
        experiences[i].model.material = mat;

        // experiences[i].model = BABYLON.MeshBuilder.CreateSphere("sphere", {
        //     diameter: i,
        //     segments: 32,
        // }, scene);
        //experiences[i].model.position.y = i;
    }

    engine.runRenderLoop(() => {
        // Enable TWEEN animations.
        TWEEN.update(performance.now())
        scene.render()
    })

    window.addEventListener('resize', () => {
        engine.resize()
    });

    scene.onXrImageUpdatedObservable.add(e => {
        console.log("Got Image Target", e);
        for (let i = 0; i < experiences.length; i++) {
            if (experiences[i].id === e.name) {
                copyVec(e.position, experiences[i].model.position);
                //console.log("Rotations", e.rotation, experiences[i].model.rotationQuaternion);
                copyVec(e.rotation, experiences[i].model.rotationQuaternion);
                //copyVec(e.scale, experiences[i].model.scaling);
                //experiences[i].scaling.set(e.scale, e.scale, e.scale);
                return;
            }
        }
        console.error("couldn't find model corresponding to the image target");
    })
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