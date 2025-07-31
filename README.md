# 🧊 Food Expiry Tracker Web App

The **Food Expiry Tracker** is a lightweight web application that allows users to track food items and their expiration dates. This README documents how the app was containerized using Docker, deployed on two web servers, and served through a load balancer (HAProxy).

---

## 📦 Docker Hub Repository

- **Repository URL**: [https://hub.docker.com/r/yourdockerhubusername/food-expiry-tracker](https://hub.docker.com/r/yourdockerhubusername/food-expiry-tracker)
- **Image Name**: `yourdockerhubusername/food-expiry-tracker`
- **Tags**:
  - `latest`
  - `v1.0`

---

## 🔧 Build Instructions

To build the Docker image locally:

```bash
docker build -t yourdockerhubusername/food-expiry-tracker:latest .
```
### Tag and push to Docker Hub:
```
docker tag yourdockerhubusername/food-expiry-tracker:latest yourdockerhubusername/food-expiry-tracker:v1.0
docker push yourdockerhubusername/food-expiry-tracker:v1.0
```
### Run Instructions (Web01 & Web02)
On Web01 and Web02:
```
docker pull yourdockerhubusername/food-expiry-tracker:v1.0

docker run -d \
  --name food-tracker \
  -p 80:80 \
  -e DB_URL=mongodb://your-db-url \
  -e SECRET_KEY=your-secret-key \
  yourdockerhubusername/food-expiry-tracker:v1.0
```
### HAProxy Configuration (on Lb01)
```
frontend http_front
    bind *:80
    default_backend http_back

backend http_back
    balance roundrobin
    option httpchk
    server web01 192.168.10.11:80 check
    server web02 192.168.10.12:80 check
```
### Reload HAProxy
```
sudo haproxy -c -f /etc/haproxy/haproxy.cfg   # Validate
sudo systemctl reload haproxy                # Apply changes
```
### Testing & Verification
##### Step 1: Access the Application via Load Balancer
```
curl http://<Lb01-IP>
```
Step 2: Confirm Load Distribution
Observe alternating responses (e.g., hostname, color, message).

Monitor container logs:
```
docker logs food-tracker
```
Monitor HAProxy logs:
```
sudo tail -f /var/log/haproxy.log
```
Secrets Management (Recommended Practice)
Avoid hardcoding secrets in Dockerfiles.

Use .env file:
```
docker run --env-file .env yourdockerhubusername/food-expiry-tracker:v1.0
```
Developed by:
*** Innocent Tito Muvunyi***
