#!/bin/bash

# This script deploys Prototipar to a specific folder
# it also launches are docker container, and updates nginx file

# parameters: app_path, url, http_port_internal, http_port_external,

if [ $# -lt 4 ]; then
echo "Usage: $0 <app path> <app url> <nodejs http port> <nginx http port>"
echo "\t<app path>: Path to where logs, sketches, and settings will be saved"
echo "\t<app url>: App URL (e.g., server.prototipar.io)"
echo "\t<nodejs http port>: Port where NodeJs should listen (This is important because the TCP port is this port plus 2)"
echo "\t<nginx http port>: External port that binds to the container's internal port"
exit 1
fi

if [ "$(whoami)" != "root" ]; then
echo "For now, you need to run this script as root. Trying using sudo"
exit 1
fi


APP_PATH=$1
APP_URL=$2
APP_HTTP_PORT_INTERNAL=$3
APP_HTTP_PORT_EXTERNAL=$4
APP_TCP_PORT_INTERNAL=$(($APP_HTTP_PORT_INTERNAL+2)) 
PAPERPIC_PATH=`git rev-parse --show-toplevel`/PaperPic-NodeJs

# Create app path
mkdir -p $APP_PATH

if [ $? -ne 0 ]; then
    echo "Error creating foldere $APP_PATH"
    exit 1
fi

echo "Created folder $APP_PATH"

# Copies files from paper-pic
# (this script expects to be running 
cp -rf $PAPERPIC_PATH/config $APP_PATH
cp -rf $PAPERPIC_PATH/files $APP_PATH
mkdir -p $APP_PATH/logs 

# Create configuration file
prototipar_config_file="
module.exports =
{
    httpServer:
    {
        url: \"$APP_URL\",
        port: $APP_HTTP_PORT_INTERNAL,
        host: \"0.0.0.0\"
    },
    log:
    {
        filePath: \"logs/server.log\",
        console: false,
        file: true
     }
}
"

echo "$prototipar_config_file" > $APP_PATH/config/config.js
echo "Created configuration file $APP_PATH/config/config.js"

# Todo: Fix permissions for the server
chmod 777 -R $APP_PATH

# creates strng for nginx config file
nginx_config_file="
server {
    listen 80;

    server_name $APP_URL;

    location / {
        proxy_pass http://127.0.0.1:$APP_HTTP_PORT_EXTERNAL;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
         # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \"Upgrade\";

        proxy_connect_timeout 1d;
        proxy_send_timeout 1d;
        proxy_read_timeout 1d;
   }
}"

echo "$nginx_config_file" > /etc/nginx/sites-enabled/$APP_URL 

# Restarting nginx
service nginx restart
echo "Restarted nginx"

# Remove any instances
docker stop $APP_URL
docker rm $APP_URL

# Launch Docker
docker run -d -t \
--name $APP_URL \
--mount type=bind,source="$APP_PATH/files",target=/usr/src/app/files \
--mount type=bind,source="$APP_PATH/logs",target=/usr/src/app/logs \
--mount type=bind,source="$APP_PATH/config",target=/usr/src/app/config \
--restart unless-stopped \
-p 127.0.0.1:$APP_HTTP_PORT_EXTERNAL:$APP_HTTP_PORT_INTERNAL \
-p $APP_TCP_PORT_INTERNAL:$APP_TCP_PORT_INTERNAL \
weibellab/prototipar-web

echo "Launched Docker"

