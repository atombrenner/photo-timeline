set MY_MEDIA=%~dp0%..
start "Photo-Timeline Server" /MIN node server.js
time /T 1
start http://localhost:9000/index.html

