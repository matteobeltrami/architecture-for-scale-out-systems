## T1.1 - Forking the project [basic]

### Assignment 
Your first task is simple - fork ScalyShop. ScalyShop consists of two Javascript projects - one for the REST-based backend and a Vue.js SPA frontend. Log in to GitLab and locate the "group" we created for you ("dat490-2025-groupid"). A "group" in GitLab is basically a folder containing related projects. All your project work for the remainder of the course should go into this group.
Fork the backend and frontend projects into your group. You can do this by navigating to the project, clicking on the "Fork" button, and selecting your group as the namespace (set the visibility to "private").
Clone your projects now, and follow the initial installation instructions. Make sure that you have Node and MongoDB installed on your computer.
Start the application according to the installation instructions, and make sure that the application successfully starts and is operable. If you find problems in the installation instructions, please provide a pull request with suggested updates (or at least create an issue in the project repository).
(Very briefly) document your working solution in your report. It's sufficient to add one or two screenshots of the working application, and describe problems you had to overcome (if any).

### Solution
- Install [NodeJS](https://nodejs.org/en/download) and [MongoDB](https://dev.to/saint_vandora/how-to-install-mongodb-locally-on-a-macbook-5h3a).
- See the instrucitons for running the [backend](https://git.chalmers.se/courses/dat490/resources/scaly-shop-v2/scalyshop-v2-backend) and the [frontend](https://git.chalmers.se/courses/dat490/resources/scaly-shop-v2/scalyshop-v2-frontend)
- Enter in the backend repository and launch the following commands to start the backend 
```shell
npm install
npm run dev
```
Here `http://localhost:5045` you should receive an OK message
- Open another shell and start MongoDB 
```shell
brew services start mongodb/brew/mongodb-community
mongod
```
- Enter in the frontend repository and launch the following commands to start the frontend 
```shell
npm install
npm run serve
```
then enter `http://localhost:5046/` in the browser or the localhost showed by the frontend application.

## T1.3 - Dockerize the application  [basic]

### Assignment 
Much of our future delivery pipeline will assume that our application components are available as Docker containers, so now our next step is to dockerize the application.  As we learned in Lecture 3, Docker  is a container format that is incredibly widely used in cloud computing. As a first step, make sure to install Docker on your computer.
Then you should build two or three working Docker images, one each for frontend and backend, and optionally one for the database (but you can also just start a MongoDB image directly). Build on suitable base images and configure each image correctly (the Node.js docker image may be a good starting point, but you can choose any base image that works for you).
Run your images (in the right order - database, backend, frontend) and validate that all images start correctly. If you have configured everything accurately, you should now be able to test the application by navigating to the correct URL (for example http://localhost:5046/) and clicking around in the application, in the same way as when you started your application without Docker. Check for errors in the Docker logs of your images.
Tips:

A common source of errors are incorrect port numbers, incorrect port mapping, or other issues related to Docker's virtual networking. Refer to the lecture and the online documentation of Docker and make sure that you are exposing and using the correct ports for all services.
ScalyShop uses environment variables to configure endpoints, ports, database username, database password, etc. Many of these options have suitable default values for this first deployment task, but it is possible that you will have to provide custom values for some. In this case, make sure to set the right environment variable, do not just change the value in the source code.

Push your Dockerfiles to the master of your GitLab projects. Document your working solution in your report. It's sufficient to describe the final solution in a few sentences.

### Solution 
Write a docker files for both the backend and the forntend as follows.

- Backend dockerfile:
```docker
FROM node:22-alpine

RUN apk add curl && apk cache clean

WORKDIR /app

COPY package.json .

RUN --mount=type=cache,target=/root/.npm npm install --no-progress --no-audit

COPY . .

# Checking the health route of the service itself
HEALTHCHECK --interval=30s --timeout=30s --retries=5 \
  CMD curl http://localhost:5045/

CMD ["npm", "start"]
```
- Frontend dockerfile:
```docker
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json .

RUN --mount=type=cache,target=/root/.npm npm install --no-progress --no-audit

COPY . .

RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine AS runtime

WORKDIR /app

COPY --from=builder /app/dist/. .
COPY nginx.conf /usr/share/nginx/nginx.conf


HEALTHCHECK --interval=30s --timeout=30s --retries=5 \
  CMD ["curl", "http://localhost:8080"]

CMD ["nginx", "-c", "/usr/share/nginx/nginx.conf", "-g","daemon off;"]

```

- Create and run the docker network to let the parties communicate. We can check the networks running with `docker network ls`

```shell
docker network create scalyshop 

docker run --network scalyshop \
  --name mongo-container \
  -p 27017:27017 \
  mongo:8
```

- Build and run both dockerfiles by entering their repository and launching the following commands:
```shell
cd scalyshop-v2-backend
docker build -t backend-image .
docker run --network scalyshop -e MONGODB_HOST=mongo-container --name backend-container -p 5045:5045 backend-image
```
```shell
cd scalyshop-v2-frontend
docker build -t frontend-image .
docker run --name frontend-container -p 8080:8080 frontend-image
```



## T1.4 - Upload your Docker images to the GitLab Image registry  [basic]

### Assignment 
If you open GitLab, you will notice that it actually contains its own (private) image registry for Docker images (navigate to "Deploy", and then to "Container registry"). Upload your ScalyShop images to this registry, and validate that you can use it to start new containers.
To authenticate with GitLab, you will need to create an access token first in the GitLab UI. You can then login to the GitLab registry using the docker login registry.git.chalmers.se command (using your access token as password). Then you can build and push your images to the registry.
Briefly document the necessary steps and your published images (screenshot!) in your report.

### Solution 
- Login to the gitlab registry:
```shell
docker login registry.git.chalmers.se
```
then build and push an image 
```shell
docker build -t registry.git.chalmers.se/courses/dat490/students/2025/dat490-2025-4/scalyshop-v2-backend .
docker push registry.git.chalmers.se/courses/dat490/students/2025/dat490-2025-4/scalyshop-v2-backend
```

## T1.5 - Create a composition with docker-compose  [optional, 20 pts]

### Assignment
Now create a composition that represents your entire application using Docker-Compose (you probably installed it already along with Docker). Write a single `docker-compose.yaml` file that starts your entire application, including the database (don't assume a MongoDB database is already running, even though you likely installed MongoDB in the first task). Again validate that your composition works by navigating to, for example, http://localhost:5046/ and clicking around in the application.
Note that the CI pipeline we will build in subsequent assignments will not use this docker-compose file, but it will remain a tremendously helpful tool to quickly spin up the application for local development and testing. In future assignments, I will also use docker-compose to start and test your application locally, so make sure it continues to work throughout the other assignments.
Tips:
You can either use the Docker images you wrote in the previous task, or define the services in your composition directly based on standard Node images.
Don't forget that in a docker-compose composition, services can be addressed through their service name (i.e., the service name becomes the internal DNS name of that service).
As in the previous task, make sure to use the right port numbers, and use environment variables to set parameters such as the database or backend host names.

Push your docker-compose file to the master of the frontend GitLab project. Document your working solution in your report. It's sufficient to describe the final solution in a few sentences.

### Solution 
- create a docker compose file as the following `docker-compose.yaml`:
```docker
services:
  backend:
    image: registry.git.chalmers.se/courses/dat490/students/2025/dat490-2025-4/scalyshop-v2-backend:latest
    build:
      context: .
      platforms:
        - linux/amd64
    restart: on-failure
    environment:
      - MONGODB_HOST=database
    platform: linux/amd64
    networks:
      - scalyshop2-net
    depends_on:
      database:
        condition: service_healthy
        restart: true
    ports:
      - 5045:5045

  database:
    image: mongo:8
    restart: on-failure
    networks:
      - scalyshop2-net
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet

  frontend:
    image: registry.git.chalmers.se/courses/dat490/students/2025/dat490-2025-4/scalyshop-v2-frontend:latest
    build:
      context: ../scalyshop-v2-frontend
      platforms:
        - linux/amd64
    platform: linux/amd64
    depends_on:
      backend:
        condition: service_healthy
        restart: true
    restart: on-failure
    networks:
      - scalyshop2-net
    ports:
      - 8080:8080

networks:
  scalyshop2-net:
```
- Go in the same directory and run the command to start the docker composition (`--build` if you also need to  build it):
```shell
docker-compose up --build
```
to close the composition run
```shell
docker-compose down
```