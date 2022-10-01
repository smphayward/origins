#! /bin/bash

# See: https://docs.docker.com/engine/install/ubuntu/
# See: https://docs.docker.com/compose/install/

# Uninstall older version
 sudo apt-get remove docker docker-engine docker.io containerd runc

# Update  apt package index
 sudo apt-get update

 # Add GPG key
sudo mkdir -p /etc/apt/keyrings
 curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

 # Setup Repo
 echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

  # Update  apt package index again
 sudo apt-get update

 # Install Docker Engine
 sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Check the version
docker --version

# Install Docker Compose
sudo apt-get install docker-compose-plugin

# Check the version
docker compose version