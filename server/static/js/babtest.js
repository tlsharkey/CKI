var canvas, scene, engine, camera, surface;
var videoPlayers = [];
var videos = ["video/whistle.mp4", "video/test.mp4", "video/signs.mp4"];

const startScene = () => {
    const canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);
    camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -10), scene);

    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);

    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

    for (let i = 0; i < videos.length; i++) {
        // Create Material
        let mat = new BABYLON.StandardMaterial("mat" + i, scene);
        mat.diffuseTexture = new BABYLON.VideoTexture("video" + videos[i], videos[i], scene, true);
        mat.diffuseTexture.video.loop = false;
        mat.diffuseTexture.video.autoplay = false;

        // Create Player
        let player = BABYLON.MeshBuilder.CreatePlane("plane" + i, {
            width: 5,
            height: 5
        }, scene);
        player.position.y = 0;
        player.position.x = 6 * i - 3 * (videos.length - 1);
        player.material = mat;

        videoPlayers.push(player);

        // Generate Buttons
        let button = document.createElement("button");
        button.setAttribute("targetIndex", i);
        button.innerHTML = "video " + i;
        button.addEventListener("click", function(ev) {
            let vid = videoPlayers[parseInt(ev.target.getAttribute("targetindex"))].material.diffuseTexture.video;
            playPauseVideo(vid);
        });
        document.body.appendChild(button);
    }

    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener('resize', function() {
        engine.resize();
    });
}

function playPauseVideo(video) {
    if (video.paused || video.ended) {
        video.play();
    } else {
        video.pause();
    }
}