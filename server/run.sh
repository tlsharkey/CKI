echo "Version Name: "
read name
docker build -t weibellab/cki-$name .
sed -i "/weibellab/c weibellab/cki-$name" devtools/deploy*
cat deploy* | grep "weibellab"
sudo bash ./deployDockerizedWebsite.sh /opt/cki cki.prototipar.io 443 443
