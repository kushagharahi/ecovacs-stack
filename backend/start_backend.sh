#!/usr/bin/env bash
set -e

echo "Exporting environment variables..."
export BASE_URL="https://localhost"
export BASE_URL_01="https://ecovacs.com"
export MYSQL_USER="dev"
export MYSQL_PASSWORD="dev"
export MYSQL_DATABASE="dev"
export TZ="America/New_York"
export HOST_IP="127.0.0.1"

# For debugging: print out the BASE_URL values
env | grep '^BASE_URL'

cd /opt/app/backend

# Run certificate generation (if needed)
./generate_certs.sh

# Start the backend process 
exec yarn start