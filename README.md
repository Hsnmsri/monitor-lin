# MonitorLin
MonitorLin is a lightweight monitoring tool for Linux systems, designed to track system performance and resource usage efficiently.

## Docker Hub Container

You can find the official Docker image for **Monitor-Lin** on Docker Hub:

🔗 [hosseinmansouri/monitor-lin](https://hub.docker.com/r/hosseinmansouri/monitor-lin)

### Pull the Image

To pull the latest version of the image, run:

```bash
docker pull hosseinmansouri/monitor-lin:latest
```

## Installation (Docker)

1. **Create directory for app**
```bash 
mkdir /opt/monitor-lin
cd /opt/monitor-lin
```
2. **Create env file**
```bash
nano env
```
- Paste the above settings with your own data
```text
# Node
NODE_NAME=
CPU_LIMIT=
MEMORY_LIMIT=
DISK_DF_PATH=df_output.txt

# Telegram bot
BOT_NAME=
BOT_TOKEN=
ADMINS=

# Proxy
PROXY_HOST=
PROXY_PORT=
```
- If you want to use the proxy from your system, you should set the PROXY_HOST parameter to host.docker.internal.
- PROXY_PORT is your system local proxy port.
- Ensure that you proxy is configured to bind to 0.0.0.0 instead of 127.0.0.1

3. **Config df_output.txt file and cron job**
```bash
wget https://raw.githubusercontent.com/Hsnmsri/monitor-lin/refs/heads/main/df_output.sh
sudo chmod +x df_output.sh
```

4. **Set cron job for run df_output.sh**
```bash
sudo crontab -e
```
- set "*/30 * * * * /opt/monitor-lin/df_output.sh"

5. **Create docker network**
```bash 
docker network create \
 --subnet=172.30.0.0/16 \
 monitor-lin-net
``` 

6. **Create docker-compose and run app**
```bash 
nano docker-compose.yml
```
and set above config 
```yml
version: '3.8'

services:
 monitor-lin:
   image: hosseinmansouri/monitor-lin
   container_name: monitor-lin
   restart: unless-stopped
   volumes:
     - ./env:/app/.env
     - ./df_output:/app/df_output
   extra_hosts:
     - "host.docker.internal:host-gateway"
   networks:
     - monitor-lin-net

networks:
 monitor-lin-net:
   external: true
```

7. **Run app**
```bash 
docker-compose up -d
```

# Development

## Getting Started with Development

1. **Clone the Repository**  
  ```bash
  git clone git@github.com:Hsnmsri/monitor-lin.git
  cd monitor-lin
  ```

2. **Install Dependencies**  
  Ensure you have Node.js and npm installed. Then, install the required dependencies:
  ```bash
  npm install
  ```

3. **Set Up the Environment**  
  Configure the environment variables:
  ```bash
  cp src/environment/environment.example.ts src/environment/environment.ts
  nano src/environment/environment.ts
  ```

4. **Run the Application**  
  Start the development server:
  ```bash
  npm run start:dev
  ```

5. **Run Tests**  
  Verify the codebase by running tests:
  ```bash
  npm run test
  ```

6. **Start Contributing**  
  - Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature-name
    ```
  - Make your changes and commit them:
    ```bash
    git add .
    git commit -m "Description of changes"
    ```
  - Push your branch and create a pull request:
    ```bash
    git push origin feature-name
    ```

7. **Follow Coding Standards**  
  Ensure your code adheres to the project's coding guidelines and is well-documented.

8. **Join Discussions**  
  Participate in discussions and contribute to the project's roadmap.
