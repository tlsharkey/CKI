## Get SSL key and certificate
[go through walkthrough here](https://ksearch.wordpress.com/2017/08/22/generate-and-import-a-self-signed-ssl-certificate-on-mac-osx-sierra/)
You need to access the server from an HTTPS connection - phones will only allow access to the camera if it's on a secured page.
Once you have your key and certificate, move them to the config folder on this server.

# Running the Server
1. Make sure you have Node.js installed ( [download here](https://nodejs.org/en/download/ "Node Download") )
2. From command line: `npm install` in this directory
3. `npm start` to start up the server
You should then be able to access the website by going to the address printed in the terminal (eg: `http://192.168.1.12:3000`)
This will open the web navigation part of the server

## To Post/Upload to Server
To create a new marker/tag go to `http://serveraddress/create`
for developers: send POSTs to `http://serveraddress/upload`
