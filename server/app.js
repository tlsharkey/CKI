// =============================================================================
// Imports
const express = require("express");
const https = require("https");
const http = require("http");
const path = require("path");
const WebSocketServer = require("ws").Server;
const formidable = require("formidable");
const dgram = require("dgram");
const fs = require("fs");
const net = require("net");
const _config = require("./config/config");

const app = express();


// =============================================================================
// Globals
var tcpDevices = [];
var wsDevices = [];
var wsDeviceIds;
const HTTP_PORT = _config.httpServer.port;
const TCP_PORT = _config.tcpServer.port;
const ADDRESS = _config.httpServer.address;
const EXPERIENCES_PATH = "./uploaded_experiences/";
const PAGE = "./static/";
const httpsCerts = {
    key: fs.readFileSync("config/server.key"),
    cert: fs.readFileSync("config/server.crt")
};



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
        while (tcpBuffer.length != 0) {
            let msg = getJsonFromBuffer();

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
                        console.log("Not Implemented Yet");
                        break;
                    default:
                        /* Unknown Type */
                        console.error("Got Unknown TCP message type:", JSON.stringify(msg));
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
            tcpClients.splice(tcpClients.indexOf(sock), 1);
        }
    });

    /* Handle Error */
    sock.on("error", function(err) {
        if (err.code === "ECONNRESET") {
            console.log("Peer forcibly closed tcp connection", sock.remoteAddress);
            if (tcpDevices.indexOf(sock) !== -1) {
                tcpClients.splice(tcpClients.indexOf(sock), 1);
            }
        } else {
            console.error("TCP Error. Closing Connection to peer", sock.remoteAddress);
            if (tcpDevices.indexOf(sock) !== -1) {
                tcpClients.splice(tcpClients.indexOf(sock), 1);
            }
        }
    })
}).listen(TCP_PORT, ADDRESS);



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
    res.sendFile(__dirname + "/static/viewer.html");
    console.log("Served viewer");
})

app.get("/3", function(req, res) {
    res.sendFile(__dirname + "/static/three_eg.html");
    console.log("Server threejs example");
})

app.post("/upload", function(req, res) {
    console.log("Got Post");
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        redirect("/map");
        let oldpath = files.filetoupload.path;
        let newpath = __dirname + "/uploaded_experiences" + files.filetoupload.identifier;
        fs.rename(oldpath, newpath, function(err) {
            if (err) return console.err("Failed to save", oldpath, "as", newpath, err);
            console.log("Upload Successful");
            res.write("Submitted and Saved");
            res.end();
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
https.createServer(httpsCerts, app).listen(443);


// =============================================================================
// Web Socket
// =============================================================================

const wss = new WebSocketServer({
    server: httpServer
});

wss.on("connection", function(ws, req) {
    ws.id = ++wsDeviceIds;

    wsDevices[ws.id] = {
        socket: ws,
        id: ws.id,
        requests: []
    }

    console.log("Websocket", ws.id, "connected");

    ws.on("message", function(message) {
        var msg;
        try {
            msg = JSON.parse(message);
        } catch (err) {
            return console.error("Invalid Websocket message received");
        }

        if (msg && "type" in msg) {
            switch (msg.type) {
                case "asdf":
                    // Do Something
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
        delete clientList[ws.id];
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