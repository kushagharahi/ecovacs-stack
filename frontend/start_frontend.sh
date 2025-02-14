#!/usr/bin/env bash
set -e

# Export all necessary environment variables
export TZ="America/New_York"

# Change directory and start the frontend
cd /opt/app/frontend

echo "Serving static frontend build..."
# Serve the static files in the "build" folder on port 4200.
exec ./node_modules/.bin/serve -s build -l 4200
