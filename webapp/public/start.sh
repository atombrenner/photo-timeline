#!/bin/bash
set -euo pipefail

MY_MEDIA="$(dirname "$(dirname "$0")")"
export MY_MEDIA

node "$MY_MEDIA/photo-timeline/server.js" &
xdg-open http://localhost:9000/index.html &
