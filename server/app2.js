// =============================================================================
// Imports
const express = require("express");
const fileUpload = require('express-fileupload');
const https = require("https");
const http = require("http");
const path = require("path");
const WebSocketServer = require("ws").Server;
const formidable = require("formidable");
const dgram = require("dgram");
const fs = require("fs");
const net = require("net");
const _config = require("./config/config");
const apiKey = require("./static/assets/googleMapsApiKey");
const ffmpeg = require("ffmpeg");

const app = express();

// =============================================================================
// Globals
var tcpDevices = [];
var wsDevices = [];
var wsDeviceIds = 0;
const HTTP_PORT = _config.httpServer.port;
const TCP_PORT = _config.tcpServer.port;
const ADDRESS = _config.httpServer.address;
const EXPERIENCES_PATH = "./uploaded_experiences/";
const PAGE = "./static/";
const httpsCerts = {
    key: fs.readFileSync("config/server.key"),
    cert: fs.readFileSync("config/server.crt")
};

var assets = []
getExperiences();
var serverStickers = [
    "broccoli.png", "buddah-fox", "embarassed-fox", "fab-fox", "flower-pentagram",
    "fox-bark", "fox-hearts", "high-paw", "magic-flower", "magic-heart",
]



// =============================================================================
// TCP Server
// =============================================================================

var tcpBuffer = Buffer.from([]);
/** Read a message from the Buffer.
 * Checks for a unsigned 32 bit int to designate the packet size
 * then reads the message as being that size
 * @return the read message as a JavaScript object
 */
function getJsonFromBuffer() {
    var uint32_length = 4;
    let dataStr = tcpBuffer.toString('utf8');

    // Check for message length
    if (!dataStr.slice(0, 4).match(/[0-9][0-9][0-9][0-9]/)) {
        // clear buffer
        tcpBuffer = tcpBuffer.slice(0, 0);
        console.error("When checking buffer for uint32, didn't find one:", dataStr);
        return {};
    } else {
        // Get Message
        messageLength = parseInt(dataStr.slice(0, uint32_length));
        let message = dataStr.slice(uint32_length, messageLength + uint32_length);

        // Remove message from buffer
        tcpBuffer = tcpBuffer.slice(messageLength + uint32_length, tcpBuffer.length);

        // Create Object from message
        let json;
        try {
            json = JSON.parse(message);
            return json;
        } catch (e) {
            console.error("When parsing Buffer message, didn't get a JSON:", message);
            return {};
        }
    }
}


/** TCP Server
 * AR Devices will connect to the TCP Server to download Experiences
 * There may also be some communication to show where devices are located
 * when viewing from the map
 */
net.createServer(function(sock) {
    console.log("TCP Connection established with", sock.remoteAddress, ":", sock.remotePort);

    /* Prevent Bots from connecting:
     * close connections to devices which haven't sent a valid 'verification' message
     * within 2 seconds of connecting.
     */
    let verified = false;
    setTimeout(function() {
        if (!verified) {
            console.warn("TCP Connection aborted because device didn't verify itself", sock.remoteAddress);
            sock.destroy();
        }
    }, 2000);


    /* Handle Messages */
    sock.on("data", function(data) {
        tcpBuffer = Buffer.concat([tcpBuffer, new Buffer.from(data)]);

        while (tcpBuffer.length != 0) {
            let msg = getJsonFromBuffer();
            console.log("Message from buffer", msg);

            if ("type" in msg) {
                switch (msg.type) {
                    case "verification":
                        /* Checks for a verification code from the device.
                         * if code is 'Kitty Kitty', accepts the connection
                         * otherwise rejects it.*/
                        if ("code" in msg && msg.code === "Kitty Kitty") {
                            tcpDevices.push(sock);
                            verified = true;
                            console.log("Verified Connection with", sock.remoteAddress, ":", sock.remotePort);

                            tcpSend(sock, {
                                type: "verificationConfirmation"
                            });
                        } else {
                            console.warn("Got invalid verification message:", JSON.stringify(msg), "closing connection");
                            sock.destroy();
                        }
                        break;
                    case "getExperiences":
                        /* A request from a device to get the experience information
                         * Looks at the passed GPS coordinates,
                         * and determines which experiences should be given to the device
                         * responds with a list of experience identifiers
                         * for the device to download */
                        tcpSend(sock, {
                            type: "experiences",
                            experiences: assets
                        });
                        break;
                    case "getOptions":
                        sendUploadOptionsTcp(sock);
                        break;
                    case "experienceUpload":
                        console.log("==== UPLOADING EXPERIENCES ====");
                        handleTcpUpload(msgObj);
                        break;
                    default:
                        /* Unknown Type */
                        let printMsg = JSON.stringify(msg);
                        if (printMsg.length > 200) {
                            printMsg = printMsg.slice(0, 200);
                        }
                        console.error("Got Unknown TCP message type:", printMsg);
                        break;
                }
            } else {
                console.error("Got Message without a type", JSON.stringify(msg, null, 4));
            }
        }
    });

    /* Handle Close */
    sock.on("close", function(data) {
        console.log("TCP Connection from", sock.remoteAddress + ":" + sock.remotePort, "closed by remote");
        if (tcpDevices.indexOf(sock) !== -1) {
            tcpDevices.splice(tcpDevices.indexOf(sock), 1);
        }
    });

    /* Handle Error */
    sock.on("error", function(err) {
        if (err.code === "ECONNRESET") {
            console.log("Peer forcibly closed tcp connection", sock.remoteAddress);
            if (tcpDevices.indexOf(sock) !== -1) {
                tcpDevices.splice(tcpDevices.indexOf(sock), 1);
            }
        } else {
            console.error("TCP Error. Closing Connection to peer", sock.remoteAddress);
            if (tcpDevices.indexOf(sock) !== -1) {
                tcpDevices.splice(tcpDevices.indexOf(sock), 1);
            }
        }
    })
}).listen(TCP_PORT, ADDRESS);

function handleTcpUpload(msgObj) {
    let location = msgObj.location;
    let id = msgObj.id;
    let thumbnail = msgObj.thumbnail;
    let video = msgObj.experience.data;
    let filename = msgObj.experience.filename;

    // Save Video
    fs.writeFile(__dirname + "/static/assets/video/" + filename, video, function(err) {
        if (err) {
            return console.error("Failed to write experience " + err);
        }
        console.log("Added Video", filename);
    });

    // Save Experience Data
    let dataToAdd = {
        id: id,
        thumbnail: thumbnail,
        experience: "video/" + filename,
        location: location
    }


    fs.stat(__dirname + "/appState.json", function(err, stat) {
        if (err == null) { // File Exists
            fs.readFile(__dirname + "/appState.json", 'utf8', function(err, data) {
                if (err) return console.error("Error Reading", filename);

                let experiences = JSON.parse(data.toString());
                experiences.push(dataToAdd);
                assets = experiences;

                fs.writeFile(__dirname + "/appState.json", JSON.stringify(experiences, null, 4), function(err) {
                    if (err) {
                        return console.error("Failed to update application state " + err);
                    }

                    for (let i = 0; i < wsDevices.length; i++) {
                        if (wsDevices[i]) {
                            wsDevices[i].socket.send(JSON.stringify({
                                type: "uploadComplete"
                            }));
                        }
                    }

                    console.log("Added Experience", experience);
                });
            });
        } else if (err.code == 'ENOENT') { // File Doesn't Exist
            console.error("appState File Didn't exist, but it should have " + err);
        } else {
            console.error("error while reading appState file " + err);
        }
    });
}


// =============================================================================
// HTTP Server
// =============================================================================

app.use("/js", express.static("static/js"));
app.use("/css", express.static("static/css"));
app.use("/html", express.static("static/html"));
app.use("/robots.txt", express.static("static/robots.txt"));
app.use("/webfonts", express.static("static/webfonts"));
app.use("/assets", express.static("static/assets"));
app.use("/xrextras.js", express.static("xrextras/src/xrextras.js"));
app.use("/video", express.static("static/assets/video"));
app.use("/audio", express.static("static/assets/audio"));
app.use(fileUpload());

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/static/root.html");
    console.log("Served Root");
});

app.get("/map", function(req, res) {
    res.sendFile(__dirname + "/static/map.html");
    console.log("Served Map");
});

app.get("/create", function(req, res) {
    res.sendFile(__dirname + "/static/createExperience.html");
    console.log("Served create");
});

app.get("/experience", function(req, res) {
    //res.sendFile(__dirname + "/static/viewer.html");
    res.sendFile(__dirname + "/static/three_eg.html");
    console.log("Served viewer");
});

app.get("/bab", function(req, res) {
    res.sendFile(__dirname + "/static/babylontesting.html");
    console.log("Server Bab");
});

app.get("/3", function(req, res) {
    res.sendFile(__dirname + "/static/three_eg.html");
    console.log("Server threejs example");
});

app.post("/uploadDeviceExperienceData", function(req, res) {
    console.log("Uploading ExperienceData from Device...");
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            return console.error("Problem uploading experience", err);
        }
        console.log("Got data upload data", fields, files);
        lastUploadDetails = fields;
    });
});

app.post("/uploadDeviceExperienceVideo", function(req, res) {
    console.log("Uploading Experience from Device...");
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let video = req.files.video;
    console.log(req.files.video);

    // Use the mv() method to place the file somewhere on your server
    video.mv(__dirname + "/static/assets/video/" + video.name, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        res.send('File uploaded!');
    });
});


var lastUploadDetails = null; // TODO: create identifiers to avoid concurrent uploads interfering with eachother

app.post("/uploadDetails", function(req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        lastUploadDetails = {
            sticker: fields.sticker,
            location: {
                latitude: fields.latitude,
                longitude: fields.longitude
            }
        }

        console.log("Got upload details", lastUploadDetails);
    });
});

app.post("/uploadExperience", function(req, res) {
    console.log("Uploading Experience...");
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // Redirect
        //res.redirect("/map");

        let details = lastUploadDetails;
        console.log("Using", details, "for experience upload");

        // if (Object.keys(req.files).length === 0) {
        //     lastUploadDetails = null;
        //     res.status(400).send('No files were uploaded.');
        //     return;
        // }

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let videoExperience = req.files.video;
        let audioExperience = req.files.audio;
        //console.log(videoExperience.name, audioExperience.name);

        // Use the mv() method to place the file somewhere on your server
        let experience;
        let folder = (videoExperience) ? "video" : (audioExperience) ? "audio" : null;
        if (!folder) return res.status(400).send("Error, didn't get a file");

        experience = (videoExperience) ? videoExperience : audioExperience;

        experience.mv(__dirname + "/static/assets/" + folder + "/" + experience.name, function(err) {
            if (err) return res.status(500).send(err);

            // Convert and compress file
            if (folder === "audio") {
                new ffmpeg(__dirname + "/static/assets/" + folder + "/" + experience.name, function(err, audio) {
                    if (err) {
                        console.log("Failed to convert Audio", err);
                    } else {
                        console.log("Successfully created ffmpeg audio");
                        // metadata
                        console.log(audio.metadata);
                        // FFmpeg configuration
                        console.log(audio.info_configuration);

                        // Convert
                        audio.setAudioFormat("mp3");
                        audio.setAudioCodec("");

                        // Save
                        let oldType = experience.name.split('.');
                        oldType = oldType[oldType.length - 1];
                        console.log("Converted from", oldType, "to mp3");
                        let newName = experience.name.replace(oldType, "mp3");
                        audio.save(__dirname + "/static/assets/" + folder + "/" + newName, function(error, file) {
                            if (error) {
                                console.error("Failed to save audio", error);
                                return;
                            }
                            console.log('Saved new audio file as:', file);
                        });
                    }
                });
            } else if (folder === "video") {
                new ffmpeg(__dirname + "/static/assets/" + folder + "/" + experience.name, function(err, video) {
                    if (err) {
                        console.log("Failed to create ffmpeg video", err);
                    } else {
                        console.log("Successfully created ffmpeg video");
                        // metadata
                        console.log(video.metadata);
                        // FFmpeg configuration
                        console.log(video.info_configuration);

                        // Convert
                        video.setVideoFormat("mp4");
                        video.setVideoCodec("H.264");
                        video.setFrameRate(24);

                        // Save
                        let oldType = experience.name.split('.');
                        oldType = oldType[oldType.length - 1];
                        console.log("Converted from", oldType, "to mp4");
                        let newName = experience.name.replace(oldType, "mp4");
                        video.save(__dirname + "/static/assets/" + folder + "/" + newName, function(error, file) {
                            if (error) {
                                console.error("Failed to save converted video", error);
                                return;
                            }
                            console.log("Saved converted video as:", file);
                        })
                    }
                });
            }

            addExperience(details, folder + "/" + experience.name);
            res.status(200).send("Thank You");
        });
    });
});

/**
 * Hosting saved Experiences
 * uses ID in path to determine experience data to send
 */
app.get("/experience/:id(\\d+)", function(req, res, next) {
    res.write("Not Implemented Yet");
    res.end();
});

const httpServer = app.listen(HTTP_PORT, ADDRESS, () => console.log("HTTP Server Hosting On", "https://" + ADDRESS));
http.createServer(app).listen(80);
var httpsServer = https.createServer(httpsCerts, app)
httpsServer.listen(443);


// =============================================================================
// Web Socket
// =============================================================================

const wss = new WebSocketServer({
    server: httpServer,
    path: "/cnxshun"
});

wss.on("connection", function(ws, req) {
    console.log("Connecting WebSocket");

    ws.id = wsDeviceIds++;
    wsDevices[ws.id] = {
        socket: ws,
        id: ws.id,
        requests: []
    }

    console.log("Websocket", ws.id, "connected");
    ws.send(JSON.stringify({
        type: "connected"
    }));

    ws.on("message", function(message) {
        var msg;
        try {
            msg = JSON.parse(message);
        } catch (err) {
            return console.error("Invalid Websocket message received");
        }

        if (msg && "type" in msg) {
            switch (msg.type) {
                case "getExperiences":
                    console.log("Sending Experiences");
                    ws.send(JSON.stringify({
                        type: "experiences",
                        experiences: assets
                    }));
                    break;
                case "getUploadOptions":
                    console.log("Sending Upload Options");
                    sendUploadOptions(ws);
                    break;
                case "getApiKey":
                    console.log("Sending Google Maps API Key");
                    ws.send(JSON.stringify({
                        type: "apiKey",
                        key: apiKey.key
                    }));
                    break;
                default:
                    console.error("Got Unknown Websocket message type:", msg.type);
                    break;
            }
        }
    });

    ws.on("close", function() {
        console.log("Websocket", ws.id, "closed");
        disconnectPendingRequests(wsDevices[ws.id], 0); // disconnect pending requests
        delete wsDevices[ws.id];
    });
})



// =============================================================================
// Helper Functions
// =============================================================================

function disconnectPendingRequests(sock, timeout) {
    var now = new Date();
    for (var i = sock.requests.length - 1; i >= 0; i--) {
        var request = sock.requests[i];
        if (now.getTime() - request.requestTime.getTime() >= timeout) {
            // 504 it! (because the client took too long to reply)
            request.res.status(504).send('Time out!');

            // removes element from the list
            // this is safe because of the way we are iterating the array
            sock.requests.splice(i, 1);
        }
    }
}

function addExperience(target, asset) {
    let experience = {
        id: target.sticker.replace(".png", ""),
        thumbnail: target.sticker,
        location: target.location,
        experience: asset
    }

    experience.location.latitude = parseFloat(experience.location.latitude);
    experience.location.longitude = parseFloat(experience.location.longitude);

    assets.push(experience);

    fs.writeFile(__dirname + "/appState.json", JSON.stringify(assets, null, 4), function(err) {
        if (err) {
            return console.error("Failed to update application state " + err);
        }

        for (let i = 0; i < wsDevices.length; i++) {
            if (wsDevices[i]) {
                wsDevices[i].socket.send(JSON.stringify({
                    type: "uploadComplete"
                }));
            }
        }

        console.log("Added Experience", experience);
    });
}

function getExperiences() {
    let filename = __dirname + "/appState.json";
    fs.stat(filename, function(err, stat) {
        if (err == null) { // File Exists
            fs.readFile(filename, 'utf8', function(err, data) {
                if (err) return console.error("Error Reading", filename);

                let experiences = JSON.parse(data.toString());
                assets = experiences;

                console.log("Loaded Experiences", assets);
            });
        } else if (err.code == 'ENOENT') { // File Doesn't Exist
            console.error("appState File Didn't exist, but it should have " + err);
        } else {
            console.error("error while reading appState file " + err);
        }
    });
}

function findInExperiences(target) {
    let data;
    try {
        fs.statSync(__dirname + "/appState.json");
        data = fs.readFileSync(__dirname + "/appState.json");
    } catch (err) {
        return -1;
    }
    let experiences = JSON.parse(data.toString());

    for (let i = 0; i < experiences.length; i++) {
        if (experiences[i].thumbnail === target) {
            return i;
        }
    }
    return -1;
}

function sendUploadOptions(ws) {
    let folder = __dirname + "/static/assets/targets";

    fs.readdir(folder, function(err, items) {
        if (err) {
            console.error(err);
        }
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i].startsWith('.')) {
                items.splice(i, 1);
            } else if (findInExperiences(items[i]) != -1) {
                console.log(items[i], "found in appState.json. splicing");
                items.splice(i, 1);
            }
        }
        console.log("Targets", items);

        ws.send(JSON.stringify({
            type: "uploadOptions",
            options: items
        }));

    });
}

function sendUploadOptionsTcp(sock) {
    let folder = __dirname + "/static/assets/targets";

    fs.readdir(folder, function(err, items) {
        if (err) {
            console.error(err);
        }
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i].startsWith('.')) {
                items.splice(i, 1);
            } else if (findInExperiences(items[i]) != -1) {
                console.log(items[i], "found in appState.json. splicing");
                items.splice(i, 1);
            }
        }
        console.log("Targets", items);

        tcpSend(sock, {
            type: "uploadOptions",
            options: items
        });
    });
}

function tcpSend(client, msg) {
    if (!client) {
        // purge list of holos of the undefined one.
        if (tcpClients.indexOf(undefined) !== -1) {
            tcpClients.splice(tcpClients.indexOf(undefined), 1);
            console.log("Removed undefined client");
        }
        console.error("sendTo function was passed an undefined client to send to");
        return;
    }

    // Convert to string if needed
    if (typeof(msg) !== "string") {
        msg = JSON.stringify(msg);
    }


    var msgLength = Buffer.byteLength(msg, 'utf-8');
    var byteLength = new Buffer.alloc(4);
    byteLength.writeUInt32LE(msgLength, 0);

    //winston.info("Sending Message with " + msgLength.toString() + " bytes");

    // Create buffer from string
    var msgBuffer = new Buffer.from(msg, 'utf8');
    msgBuffer = Buffer.concat([byteLength, msgBuffer]);
    //console.log("\tmsgBuffer", msgBuffer, "\n\tbyteLength", byteLength);
    try {
        //tcpClients[client].write(msgLength);
        //winston.info("sending `" + msgBuffer.toString() + "`\n\tfor `" + msg + "`");
        client.write(msgBuffer);
    } catch (error) {
        winston.error("error sending message to holo " + client + " error message: " + error);
        // TODO: check if need to end connection
    }
}
