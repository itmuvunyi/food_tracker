Project Deployment Guide
This repository contains a simple web application and all the necessary instructions to deploy it on a two-server setup behind an HAProxy load balancer. The goal is to demonstrate a robust, containerized deployment process.

1. Project Files
For a complete and runnable example, this guide assumes a simple Python Flask application.

Dockerfile
This file defines the Docker image for our web application.

# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir flask

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]


app.py
This is the simple Flask application that will run in our containers. It returns the SERVER_ID environment variable to help us verify load balancing.

from flask import Flask, os

app = Flask(__name__)

@app.route('/')
def hello():
    server_id = os.environ.get('SERVER_ID', 'Unknown')
    return f"<h1>Hello from the web server!</h1><p>This request was handled by: {server_id}</p>"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)


2. Docker Image Details
The Docker image for this application is publicly available on Docker Hub. You should replace your-dockerhub-username with your actual Docker Hub username.

Docker Hub Repository URL: https://hub.docker.com/r/your-dockerhub-username/my-web-app

Image Name: your-dockerhub-username/my-web-app

Tags:

latest: The most recent stable build.

1.0.0: A specific version tag.

3. Build Instructions
To build the Docker image locally, navigate to the project's root directory (where the Dockerfile is located) and run the following command.

docker build -t your-dockerhub-username/my-web-app:1.0.0 .


After a successful build, you can push the image to your Docker Hub repository (assuming you are authenticated) using:

docker push your-dockerhub-username/my-web-app:1.0.0
docker push your-dockerhub-username/my-web-app:latest


4. Run Instructions (on Web01 & Web02)
The application containers must be run on Web01 and Web02. We will use port 8000 on the host machines, which will be accessible to the load balancer. The SERVER_ID environment variable is crucial for testing the load balancing.

On Web01
docker run -d \
  --name web_server_01 \
  -p 8000:80 \
  -e SERVER_ID="Web01" \
  your-dockerhub-username/my-web-app:1.0.0


On Web02
docker run -d \
  --name web_server_02 \
  -p 8000:80 \
  -e SERVER_ID="Web02" \
  your-dockerhub-username/my-web-app:1.0.0


5. Load Balancer Configuration
The load balancer (Lb01) uses HAProxy to route incoming traffic. The configuration is set up to distribute requests to Web01 and Web02 using the roundrobin algorithm.

HAProxy Configuration (/etc/haproxy/haproxy.cfg)
This is the relevant snippet from the HAProxy configuration file. Make sure to replace the IP addresses with the correct ones for your network.

# Frontend section to listen for incoming HTTP traffic
frontend http_front
  bind *:80
  mode http
  default_backend http_back

# Backend section to define the web servers and load balancing
backend http_back
  mode http
  balance roundrobin
  server web01 192.168.1.101:8000 check
  server web02 192.168.1.102:8000 check


To apply the new configuration, reload the HAProxy service.

sudo systemctl reload haproxy


6. Testing Steps & Evidence
To verify that the load balancer is working correctly and traffic is being distributed, you can make multiple requests to the load balancer's IP address.

Steps
Access the load balancer's IP address (e.g., 192.168.1.100) from your browser or a command-line tool.

Use curl to send several requests in a row and observe the output.

curl 192.168.1.100
curl 192.168.1.100
curl 192.168.1.100


Expected Output
You should see the output from the app.py script alternating between the two servers.

First request:

<h1>Hello from the web server!</h1><p>This request was handled by: Web01</p>


Second request:

<h1>Hello from the web server!</h1><p>This request was handled by: Web02</p>


Third request:

<h1>Hello from the web server!</h1><p>This request was handled by: Web01</p>


This round-robin pattern confirms that HAProxy is successfully distributing the load between the two web servers.

7. Hardening Step: Handling Secrets
To prevent sensitive information (like API keys or database credentials) from being baked into the Docker image, it is a best practice to pass them at runtime using environment variables.

For example, instead of hardcoding a secret, you can pass it to the container at runtime.

docker run -d \
  --name web_server_01 \
  -p 8000:80 \
  -e SERVER_ID="Web01" \
  -e SECRET_KEY="my-super-secret-key-12345" \
  your-dockerhub-username/my-web-app:1.0.0

