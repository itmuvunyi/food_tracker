# Food Expiry Tracker Web App

The **Food Expiry Tracker** is a lightweight web application that allows users to track food items and their expiration dates. 
This README documents how the app was containerized using Docker, deployed on two web servers, and served through a load balancer (HAProxy).

---

## Docker Hub Repository

- **Repository URL**: [Docker Hub](https://hub.docker.com/repository/docker/logger12/fdtracker/general)
- **Image Name**: `logger12/fdtracker`
- **Tags**:
  - `latest`

---

## Build Instructions

To build the Docker image locally:

```bash
docker build -t fdtracker:latest logger12/fdtracker:latest
```
### Tag and push to Docker Hub:
```
docker tag docker tag fdtracker:latest logger12/fdtracker:latest
docker push docker push logger12/fdtracker:latest
```
### Run Instructions (Web01 & Web02)
On Web01 and Web02:
```
docker pull logger12/fdtracker:latest
```
### HAProxy Configuration (on Lb01)
```
frontend http-in
    bind *:80
    default_backend servers

backend servers
    balance roundrobin
    server web01 172.20.0.11:80 check
    server web02 172.20.0.12:80 check
    http-response set-header X-Served-By %[srv_name]
```
### Install HAProxy inside lb-01
```
sudo apt update && sudo apt install -y haproxy
```
### Reload and restart HAProxy
```
sudo vim /etc/haproxy/haproxy.cfg # apply changes
sudo service haproxy restart # restart haproxy cfg
```
### Testing & Verification
##### Step 1: Access the Application via Load Balancer
```
curl -I http://localhost:8082
```

Use .env file:
```
docker run --env-file .env logger12/fdtracker:latest
```
### Getting Started

- `Web browsers (Chrome, Edge, etc.)`
- `An internet connection to fetch food expiry tracker from OpenFoodFacts API`

### Installation
#### Clone the repository:
```
git clone https://github.com/your-username/food_tracker.git
cd food_tracker
```
#### YouTube Link
```
https://www.youtube.com/watch?v=3ril2-_lGlw
```
Developed by:

***Innocent Tito Muvunyi***
