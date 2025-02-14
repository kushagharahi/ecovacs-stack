#!/usr/bin/env bash
set -e

# Export all necessary environment variables
export PORT=4200
export HOST=0.0.0.0
export WDS_SOCKET_PORT=0
export TZ="America/New_York"

# Change directory and start the frontend
cd /opt/app/frontend
exec yarn start
