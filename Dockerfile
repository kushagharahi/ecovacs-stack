# Use Debian-based Node.js 20 LTS image
FROM --platform=linux/amd64 node:20-bullseye

# Install dependencies (Debian equivalents of Alpine packages)
RUN apt-get update && apt-get install -y \
    bash curl wget build-essential g++ \
    libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev librsvg2-dev \
    mariadb-server mariadb-client supervisor \
    && rm -rf /var/lib/apt/lists/*

# Setup MySQL
RUN mkdir -p /var/lib/mysql /docker-entrypoint-initdb.d
COPY ./mysql/scripts/init.sql /docker-entrypoint-initdb.d/1.sql
RUN chown -R mysql:mysql /var/lib/mysql /docker-entrypoint-initdb.d

# Install mkcert for backend
RUN curl -s https://api.github.com/repos/FiloSottile/mkcert/releases/latest \
    | grep browser_download_url \
    | grep linux-amd64 \
    | cut -d '"' -f 4 \
    | wget -qi - && \
    mv mkcert-v*-linux-amd64 mkcert && chmod a+x mkcert && mv mkcert /usr/local/bin 

ENV NODE_EXTRA_CA_CERTS="/home/node/.local/share/mkcert/rootCA.pem"

RUN mkdir -p /home/node/.local/share/mkcert && \
    mkcert -install && \
    cp -r /root/.local/share/mkcert/* /home/node/.local/share/mkcert/ && \
    chown -R node:node /home/node/.local/share/mkcert

# BACKEND
# Set the working directory for the backend
WORKDIR /opt/app/backend

# Copy only the dependency files.
# This layer will be cached if package.json and yarn.lock remain unchanged.
COPY backend/package.json backend/yarn.lock ./

# Install backend dependencies with a cache mount for node_modules.
# This tells BuildKit to cache the node_modules directory between builds.
RUN yarn install --network-timeout 100000

# Now copy the rest of the backend source code.
# Changes to your source code will not invalidate the cached yarn install layer.
COPY backend ./

# FRONTEND
# Set the working directory for the frontend
WORKDIR /opt/app/frontend

# Copy only the dependency files.
# This layer will be cached if package.json and yarn.lock remain unchanged.
COPY frontend/package.json frontend/yarn.lock ./

# Install frontend dependencies with a cache mount for node_modules.
# This tells BuildKit to cache the node_modules directory between builds.
RUN yarn install --network-timeout 100000 

# Now copy the rest of the frontend source code.
# Changes to your source code will not invalidate the cached yarn install layer.
COPY frontend ./

RUN yarn build


WORKDIR /

# Setup Supervisor
COPY supervisord.conf /etc/supervisord.conf

# Expose necessary ports
EXPOSE 4200
EXPOSE 3000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
