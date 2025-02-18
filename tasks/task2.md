## T2.1 - Create an account at Google cloud [basic]

### Assignment 
Your first step is to create an account at the [Google cloud](http://cloud.google.com/). This will (unfortunately) require a valid credit card. However, if you create a new account you will get access to 300$ in credit and access to a free tier for 90 days, which in combination should be more than enough to ensure that no costs will accrue while working on the course assignments. If the free credits are used up (which should not happen in the context of this course), your cloud resources will be terminated unless you explicitly opt in to being billed.
Not every member of the group needs to create an account - you can also create one billing account and individual sub-accounts for the all group members.
It is important that you remember that, even though you are using a free tier, you are working with a real live service. Monitor your charges in the Google dashboard at least every few days, do not start large instances that you don't actually use, make sure to terminate clusters and instances that you are not using any longer, and keep your cloud credentials private. At no point should cloud or instance passwords be committed to Git or made public in some other manner.
Your group will need at least one billing account, but every group member should have access to this account (that does not mean that somebody should give out the admin password to their Google account - create subaccounts with appropriate rights). Creating individual billing accounts for multiple or all students can be useful so that everybody can experiment on their own without impacting the overal "budget", but the CI pipeline we will build next week will need to deploy into a single Google cluster.
Please do not hesitate to contact Philipp on Slack or via email if you have any questions or feel insecure about any of this.
This task does not require any explicit deliverable. Do not document your account credentials in your weekly report

## T2.2 - Getting started with Kubernetes [basic]

### Assignment 
Your next task is to get a grasp on the basics of Kubernetes. To do so, we will, for a brief moment, step away from ScalyShop and utilize an even simpler Node-based example application, which we will deploy using Kubernetes deployment files. Follow this separate [tutorial](https://git.chalmers.se/courses/dat490/dat490-project/-/blob/master/2025/KubernetesTutorial.md) for detailed instructions.

Follow steps 1 to 3 in this tutorial. Create your deployment files in the kubernetes-tutorial project. Further, briefly document your working solution in your weekly report. Document with one or two screenshots your working solution, and briefly describe any major problems you run into. Make screenshots of the Google dashboard or appropriate kubectl output that shows that you actually have a working cluster andd deployment.

### Solution 
Install `gcloud`, `kubectl` command line tools and `Helm 3`.
#### Step 1
Fork and clone the [project](https://git.chalmers.se/courses/dat490/resources/scaly-shop-v2/kubernetes-node-tutorial#) and verify it runs with `npm install`and `node index` (the application should run on `http://localhost:8000`).
Build the docker image with `docker build -t kubernetes-node-tutorial .` and upload it on GitLab as in task T1.4.
#### Step 2
Running the command `gcloud container clusters create --num-nodes 3 --region europe-north1-a dat490-cluster` we will create a cluster with 3 nodes running in the finland data-center.
#### Step 3
Create the namespace for the tutorial application `kubectl create namespace tutorial`.
Write the `deployment.yaml` and the `service.yaml` files as follows: 

`deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tutorial-k8s
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tutorial-k8s
  template:
    metadata:
      labels:
        app: tutorial-k8s
    spec:
      containers:
      - name: kubernetes-node-tutorial
        image: registry.git.chalmers.se/courses/dat490/students/2025/dat490-2025-4/kubernetes-node-tutorial:latest
        ports:
        - containerPort: 8000
        imagePullPolicy: Always
      imagePullSecrets:
      - name: gitlab-registry-secret
```

`service.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: tutorial-k8s-service
spec:
  type: LoadBalancer
  selector:
    app: tutorial-k8s
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
```
These YAML files define the configuration for deploying an application in Kubernetes, consisting of a Deployment and a Service. <br>
`imagePullPolicy: Always` → Forces Kubernetes to always pull the latest image version. <br>
`type: LoadBalancer` → Assigns a public IP to make the application accessible from the internet.

Create the secret in the namespace as follows:
```bash
kubectl create secret docker-registry gitlab-registry-secret \
  --docker-server=registry.gitlab.com \
  --docker-username=YOUR_GITLAB_USERNAME \
  --docker-password=YOUR_ACCESS_TOKEN \
  --docker-email=YOUR_EMAIL \
  -n tutorial
```
These commands deploy and expose an application in Kubernetes by applying configuration files to a specific namespace
```bash
kubectl apply -f deployment.yaml -n tutorial
kubectl apply -f service.yaml -n tutorial
```

Here are some useful commands:
- `kubectl get pods -n tutorial`: Lists all running pods in the specified namespace, showing their status and readiness.
- `kubectl describe pod <POD_NAME> -n tutorial`: Displays detailed information about a specific pod, including events and error messages.
- `kubectl logs <POD_NAME> -n tutorial`: Retrieves and displays logs from a specific pod to help debug application behavior.
- `kubectl get services -n tutorial`: Lists all services in the namespace, showing their types, IPs, and exposed ports.
- `kubectl delete secret gitlab-registry-secret -n tutorial`: Removes a specific secret from the namespace, typically used for authentication.
- `kubectl rollout restart deployment <DEPLOYMENT_NAME> -n tutorial`: Restarts all pods in the specified deployment to apply updates without downtime.


## T2.3 - Getting started with Helm [basic]

### Assignment 
We will rarely write Kubernetes deployment files by hand in practice. Instead, we will commonly use Helm, a "package manager" for Kubernetes. Let's continue with the [tutorial](https://git.chalmers.se/courses/dat490/dat490-project/-/blob/master/2025/KubernetesTutorial.md) and finish the remaining steps to learn how to deploy the same application using Helm.

Create your Helm package in the kubernetes-tutorial project andd document your working solution. Again show using screenshots that your application is successfully deployed and running.

### Solution 
Helm is a package manager for Kubernetes that simplifies the deployment and management of applications. Instead of writing and applying raw Kubernetes YAML files manually, Helm allows us to define reusable templates.

Run the following command to generate a Helm chart named `k8s-tutorial`.
```bash
helm create k8s-tutorial
```
This command creates a directory with several important files:
- `Chart.yaml` → Defines metadata such as name and version.
- `values.yaml` → Stores configurable parameters like image name, tag, replicas, and service type.
- `templates/` → Contains templated Kubernetes manifests (Deployment, Service, etc.).
- `charts/` → Holds dependencies for the chart (if any).

Edit the `values.yaml` file to set the correct image and service configuration:  
```yaml
image:
  repository: registry.git.chalmers.se/courses/dat490/students/2025/dat490-2025-4/kubernetes-node-tutorial
  pullPolicy: Always
  tag: "latest"

service:
  type: LoadBalancer
  port: 8000
```
This configuration ensures:  
- The correct Docker image is pulled.  
- The cluster always fetches the latest image version.  
- The application is accessible externally with a `LoadBalancer` service.  

Once the chart is configured, perform these steps:  
```bash
helm lint k8s-tutorial
```
This checks for syntax or structural errors in the Helm chart.  
```bash
helm package k8s-tutorial
```
This command compresses the chart directory into a `.tgz` file for deployment.  
```bash
helm install k8s-tutorial k8s-tutorial-0.1.0.tgz
```
This deploys the application using Helm, creating a Kubernetes Deployment and a Service.  
- Check if the application is running:  
  ```bash
  kubectl get pods -n tutorial
  ```
- Retrieve the public IP address of the service:  
  ```bash
  kubectl get services -n tutorial
  ```
- Test the application by navigating to the LoadBalancer IP in your browser.  

Helm makes it easy to update an application with minimal downtime.  
Edit `Chart.yaml` and change the version:  
```yaml
version: 0.1.1
```
Modify `values.yaml`.
For example, increase the number of replicas to **3**:  
```yaml
replicaCount: 3
```
Package the updated chart. 
```bash
helm package k8s-tutorial
```
Upgrade the deployed application
```bash
helm upgrade k8s-tutorial k8s-tutorial-0.1.1.tgz
```
This updates the running application without downtime.  

## T2.4 - Install MongoDB in your cluster [basic]

### Assignment
One of the core promises of Helm as a "package manager" is that it should simplify installing new dependencies into our cluster. We will now explore this by installing a basic MongoDB database in the cluster we created earlier.

We will use the [Bitnami Helm chart](https://bitnami.com/). Simply find the right package [here](https://bitnami.com/stack/mongodb/helm), and follow the installation instructions for the cluster you created (do not use the Azure marketplace version - we are not using Microsoft Azure).

When Helm successfully finishes, it will print a variety of "next steps", including instructions how to get the generated root password and how to log into your database. Save these instructions, and try them out. You should be able to log into your database.

Note: there currently seems to be a small bug in the output that this Helm chart produces. Replace `$MONGODB_ROOT_USER` with `root` in the last command when logging into your database (or simply set the environment variable to `root` before running the command).

Once you have logged into the database server, create a new database for ScalyShop called "scaly" and create a new user that our application will then use to connect to the new database. Execute the following commands from the database server shell (replace `<some-pw>` with a password of your choice):

`use scalyDB`
`db.createUser({user: "scaly", pwd: "<some-pw>", roles: ["readWrite"]})`

Refer to the [MongoDB documentation](https://docs.mongodb.com/manual/reference/method/db.createUser/) if you need more details about this step. Close the MongoDB shell and validate that you can log in using the user you just created.

Briefly document your working solution in your weekly report. Make screenshots of the Google cloud dashboard or the kubectl outputs that show that your MongoDB database has been successfully deployed. Document any major problems you had.

### Solution 

Adding the Bitnami Helm Repository:
Bitnami provides a Helm chart to deploy MongoDB in Kubernetes. First, add the Bitnami Helm repository and update it:  
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

Installing MongoDB in the Kubernetes Cluster:
We deploy MongoDB using Helm with replication enabled to ensure redundancy and scalability.  

Install MongoDB with default settings 
```bash
helm install mongo-db bitnami/mongodb
```
This installs a single-node MongoDB instance in the cluster.  

Install MongoDB with replication (Recommended for production-like setup)
```bash
helm install mongo-db bitnami/mongodb --set architecture=replication --set replicaCount=3
```
This deploys a three-node replica set for high availability.  

Verify MongoDB Deployment
```bash
kubectl get pods -n default
```
Look for `mongo-db-0`, `mongo-db-1`, and `mongo-db-2` if you enabled replication.  

Accessing MongoDB:
Once the installation is complete, Helm will display next steps, including how to retrieve credentials and connect to MongoDB.  
Retrieve MongoDB Root Credentials: 
```bash
export MONGO_ROOT_PASSWORD=$(kubectl get secret --namespace default mongo-db -o jsonpath="{.data.mongodb-root-password}" | base64 --decode)
```
Connect to MongoDB using `mongosh`: 
```bash
mongosh -u root -p $MONGO_ROOT_PASSWORD --authenticationDatabase admin
```
If you encounter errors, try replacing `$MONGO_ROOT_PASSWORD` with the actual password from the Helm output.  

Creating the `scalyDB` Database and User: 
Once logged into MongoDB, run the following commands to create a new database "scalyDB" and a user with read/write permissions:  
```javascript
use scalyDB
db.createUser({user: "scaly", pwd: "<some-pw>", roles: ["readWrite"]})
```
Replace `<some-pw>` with a secure password.  

Validate the New User Login: 
Exit the MongoDB shell and try logging in with the new credentials:  
```bash
mongosh -u scaly -p "<some-pw>" --authenticationDatabase scalyDB
```
If the login is successful, the user setup is complete.  

Verifying MongoDB Deployment:
Use the following commands to check the deployment:  

- Check MongoDB pods
  ```bash
  kubectl get pods -n default
  ```
  The pods should be in a `Running` state.  

- Check the MongoDB service
  ```bash
  kubectl get services -n default
  ```
  Look for an entry named `mongo-db` with an external IP (if LoadBalancer is used).  

## T2.5 - Deploying the ScalyShop backend in your cluster via manifest files [optional, 20pts]

### Assignment
We now return back to ScalyShop. We will first try to deploy the backend and frontend directly using Kubernetes manifest files. You will again need a deployment and service each for both application components. As database we want to use the MongoDB instance you just installed in T2.4. You can base your work on the manifest files you created in T2.2.
One new challenge you will face is that the backend needs to connect to the MongoDB instance you just installed, and that the frontend needs to know the (public) IP address of the backend (remember that the backend gets called from the browser, so cluster-internal service addresses will not work). You will need to figure out how to configure these connections in your manifest files. Make your system as flexible as you can, and avoid hard-coding IP addresses in your deployment files. Learn [how to set environment variables in the Docker container from Kubernetes](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/#using-environment-variables-inside-of-your-config).

Commit your working Manifest files, and briefly document them in your report. Also show that your backend is able to answer requests successfully. Demonstrate that your application works end-to-end.

### Solution 

In this assignment, we deploy both the backend and frontend of ScalyShop using Kubernetes manifest files. The backend connects to the MongoDB database from T2.4, while the frontend interacts with the backend.

Deploying the Backend:
The backend requires a Deployment and a Service.

Backend Deployment (`deployment.yaml`):
This manifest defines how the backend container is deployed, including its connection to MongoDB.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: scaly-backend
  labels:
    app: scaly-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: scaly-backend
  template:
    metadata:
      labels:
        app: scaly-backend
    spec:
      imagePullSecrets:
        - name: gitlab-registry-secret
      containers:
        - name: scaly-backend
          image: registry.git.chalmers.se/courses/dat490/students/2025/dat490-2025-4/scalyshop-v2-backend:latest
          imagePullPolicy: Always
          ports:
            - containerPort: 5000
          livenessProbe:
            httpGet:
              path: /
              port: 5000
          readinessProbe:
            httpGet:
              path: /
              port: 5000
          env:
            - name: MONGODB_HOST
              value: "mongodb.scaly-manifest.svc.cluster.local"
            - name: MONGODB_DB
              value: "scalyDB"
            - name: MONGODB_USER
              value: "scaly"
            - name: MONGODB_PW
              valueFrom:
                secretKeyRef:
                  name: mongodb-scaly
                  key: pw
            - name: BACKEND_PORT
              value: "5000"
```
Key Features:
- Pulls the latest backend image from GitLab.
- Defines probes for health checks.
- Uses environment variables to configure MongoDB without hardcoding values.

Backend Service (`service.yaml`):
This manifest exposes the backend via a LoadBalancer.
```yaml
apiVersion: v1
kind: Service
metadata:
  name: scaly-backend-service
spec:
  selector:
    app: scaly-backend
  type: LoadBalancer
  ports:
    - protocol: TCP
      port: 5000
      targetPort: 5000
```
Key Features:
- Uses LoadBalancer to expose the backend externally.
- Ensures the backend is reachable from the frontend.

Deploying the Frontend:
The frontend also requires a Deployment and a Service.

Frontend Deployment (`deployment.yaml`):
This manifest defines how the frontend connects to the backend.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: scaly-frontend
  labels:
    app: scaly-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: scaly-frontend
  template:
    metadata:
      labels:
        app: scaly-frontend
    spec:
      imagePullSecrets:
        - name: gitlab-registry-secret
      containers:
        - name: scaly-frontend
          image: registry.git.chalmers.se/courses/dat490/students/2025/dat490-2025-4/scalyshop-v2-frontend:latest
          imagePullPolicy: Always
          ports:
            - containerPort: 80
          livenessProbe:
            httpGet:
              path: /
              port: 80
          readinessProbe:
            httpGet:
              path: /
              port: 80
          env:
            - name: BACKEND_HOST
              value: "35.228.180.183"
            - name: BACKEND_PORT
              value: "5000"
```
Key Features:
- Pulls the latest frontend image from GitLab.
- Uses environment variables to configure the backend connection.

Frontend Service (`service.yaml`):
This manifest exposes the frontend via a LoadBalancer.
```yaml
apiVersion: v1
kind: Service
metadata:
  name: scaly-frontend-service
spec:
  selector:
    app: scaly-frontend
  type: LoadBalancer
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```
Key Features:
- Uses LoadBalancer to expose the frontend externally.
- Allows users to access the application via an external IP.

Deploying the Manifests
Apply the Backend Deployment and Service
```bash
kubectl apply -f backend/deployment.yaml
kubectl apply -f backend/service.yaml
```
Apply the Frontend Deployment and Service
```bash
kubectl apply -f frontend/deployment.yaml
kubectl apply -f frontend/service.yaml
```


## T2.6 - Write Helm charts to deploy ScalyShop [basic]

### Assignment
If you now go back to the tutorial we followed in task T2.2, you will note that writing Helm charts to deploy the frontend and the backend of ScalyShop to our new Kubernetes cluster should really not be that different since it's just two more, slightly larger, Node applications.

Write two new Helm charts, one of the frontend and one for the backend. Use them to deploy the case study app in the cluster once more, and test that the application again works (as usual). You are free to modify the ScalyShop source code if you have to, but make sure that running your application locally still works (also using Docker). As a general rule, you can make any changes you want, but you are not allowed to re-write the application in a way that would prevent you from local testing - for instance by hardcoding your Kubernetes connection strings in your application. We will test this on ocassion by trying to start your application on our own machines.

Evidently, you do not have to write a Helm chart to deploy MongoDB. Instead, your backend should be using the MongoDB instance we just installed in task T2.4, and it should be using the "scaly" user you just created, not the root account.

Some additional requirements:
- Use proper versioning for your Helm charts. Start with version 1.0.0, and increment the minor or bugfix version number for every substantial change you make (either in this assignment or in the following ones).
- The backend service should be exposing the backend on port 5000, and the frontend should work over the standard HTTP port 80. Note that this only refers to the Kubernetes services, the applications themselve can continue to run on their standard ports within their pods.
- Define a proper liveness probe for the backend - the backend should be considered "alive" if it responds to HTTP requests to the path `/api/serverstatus` with a 200 OK status code.
- Deploy your Helm charts to a separate namespace. This allows you later to cleanly remove everything related to this deployment (by simply deleting the entire namespace).

Tips:
- Once again you will need to use environment variables to properly configure both the back- and frontend.
- This time you will probably need to make some changes to the deployment.yaml and service.yaml templates that Helm initializes the package with, but do think about which configurations should best go into `values.yaml` (this makes them adjustable for the user of the ppackage), and which can be hardcoded in the templates. Expect to explain these choices during the presentation session.
- You will run into the issue that the IP address of the backend is dynamic, i.e., it changes with every re-deployment of the backend. Write your frontend Helm package in a way that you can configure the backend address with a custom `values.yaml` file on deployment, so that you don't have to always update the package itself.

Commit your Helm charts to the master of the backend and frontend repositories. Document your working solution in your weekly report. Make screenshots of the Google cloud dashboard or the kubectl outputs that show that ScalyShop has been successfully deployed, and that you can browse the store running on the Google cloud.

### Solution 

The assignment requires you to write Helm charts to deploy the frontend and backend of ScalyShop in Kubernetes. Let’s break it down in a clear and structured way

You need to:
1. Package the frontend and backend into Helm charts.
2. Deploy them into your Kubernetes cluster.
3. Ensure they work correctly and can still be run locally with Docker.

Helm simplifies Kubernetes deployments by:
- Automating resource creation (Pods, Services, ConfigMaps, etc.).
- Allowing configuration changes via `values.yaml` instead of modifying raw YAML files.
- Making deployments more maintainable and reusable

Managing Backend Connectivity:
- The backend needs to connect to MongoDB.
- The frontend needs to connect to the backend.
- Kubernetes assigns dynamic IPs to Pods, so hardcoding IPs won’t work.

Solution:
- Use Kubernetes DNS names instead of IPs.
- Example:
  - MongoDB’s DNS: `mongo-mongodb.scaly.svc.cluster.local`
  - Backend’s Service: `scaly-backend`
- The frontend gets the backend IP dynamically via environment variables.

Handling Configuration Properly:
- Hardcoding connection details inside the app makes local testing difficult.
- The backend should connect to the MongoDB inside Kubernetes but still be testable locally.

Solution:
- Use environment variables to configure database and backend connections dynamically.
- Example:
  ```yaml
  env:
    - name: MONGODB_HOST
      value: "mongo-mongodb.scaly.svc.cluster.local"
    - name: BACKEND_HOST
      value: "backend.scaly.svc.cluster.local"
  ```
- This allows:
  - Kubernetes deployment to use internal DNS names.
  - Local testing to override values easily.

---

Exposing Services Correctly:
- The frontend must be accessible over the internet
- The backend should only be accessible to the frontend.

- Backend Uses a NodePort service to expose itself within the cluster.
  ```yaml
  service:
    type: NodePort
    port: 5000
  ```
- Frontend Uses a LoadBalancer service so users can access it publicly.
  ```yaml
  service:
    type: LoadBalancer
    port: 80
  ```
- This means:
  - Users access the frontend via a public IP/domain.
  - The frontend communicates with the backend using the backend’s internal DNS name.

Health Checks:
- Kubernetes needs to know if the backend is healthy to restart it if needed.

- Define a liveness probe that checks if the backend is responding.
  ```yaml
  livenessProbe:
    httpGet:
      path: /api/serverstatus
      port: 5000
  ```
- Kubernetes will automatically restart the backend if it becomes unresponsive.

Deploying to a Separate Namespace:
- Keeping deployments organized and easy to remove

- Deploy the Helm charts in a separate namespace:
  ```sh
  kubectl create namespace scalyshop
  helm install scaly-frontend ./frontend-chart -n scalyshop
  helm install scaly-backend ./backend-chart -n scalyshop
  ```
- When you need to remove everything just delete the namespace:
  ```sh
  kubectl delete namespace scalyshop
  ```

## T2.7 - Configure an Autoscaling Deployment [optional, 20pts]

### Assignment
So far, we did not really use Kubernetes for the "cool stuff" - namely writing a scaled deployment that uses multiple pods. Time to fix this!

There are two different ways to achieve this:
- Either by configuring a (fixed) number of replicas (property replicaCount) in your Helm chart, or
- By configuring an autoscaling deployment that scales based on CPU thresholds (property autoscaling).

Experiment with both. What happens if you combine them? Can you see that requests are actually routed to different pods? Test if your autoscaler works by generating load on your backend (what's the best way to do this?). If you have troubles generating enough load to get the autoscaler to start new pods you maybe have to change the CPU thresholds for experimentation purposes.

Commit your updated Helm chart to GitLab. Document your working solution in your weekly report. Make screenshots of the Google cloud dashboard or the kubectl outputs that show that autoscaling is actually happening. Full points are only awarded if you can demonstrate that your backend actually scales.

### Solution 

Configuring an Autoscaling Deployment in Kubernetes:

So far, our backend application was running on a single pod which means it couldn’t handle high traffic efficiently. If too many users accessed the backend at the same time, the single pod would become overwhelmed, causing slow responses or failures  

To solve this, we explored two different ways of scaling the backend in Kubernetes:  
1. Fixed scaling – Setting a fixed number of replicas.  
2. Autoscaling – Automatically adjusting the number of pods based on CPU and memory usage.  


Tools Used and Their Purpose:

- `Helm` : Used to configure and deploy Kubernetes resources (e.g., pods, services, autoscalers).
- `wrk` : A command-line tool for load testing, used to simulate high traffic.
- Google Cloud Kubernetes Engine (GKE) : The cloud environment where our Kubernetes cluster is running.
- `kubectl` : The command-line tool to interact with Kubernetes (check pod status, scale deployments, etc.).

Setting a Fixed Number of Replicas:  
We first implemented a fixed scaling strategy by setting `replicaCount` in our Helm Chart:  
```yaml
replicaCount: 3
```
It means that
- Instead of running just one pod Kubernetes will now always start three pods to distribute the workload.  
- This ensures higher availability and can handle more users simultaneously.  

Testing the Scaling Effectiveness:
- We installed `wrk` on a VM inside the same Google Cloud datacenter (recommended for accurate results).  
- Ran a load test with 100 concurrent users for 500 seconds:
  ```bash
  wrk -c 100 -d 500 -t 2 http://someIP
  ```
- Results:
  - One pod: 766 requests per second.  
  - Three pods: 2294 requests per second (~3x increase).
- Issue: Fixed scaling wastes resources when traffic is low (e.g., memory usage tripled from 50MB to 150MB).  

Enabling Autoscaling:

Since fixed scaling was inefficient, we enabled Horizontal Pod Autoscaler (HPA in the Helm Chart:  
```yaml
autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 3
  targetCPUUtilizationPercentage: 60
  targetMemoryUtilizationPercentage: 80
``` 
- `minReplicas: 1` → Always keep at least one pod running.  
- `maxReplicas: 3` → Scale up to three pods when needed.  
- `targetCPUUtilizationPercentage: 60` → If CPU usage exceeds 60% Kubernetes should add more pods  
- `targetMemoryUtilizationPercentage: 80` → If memory usage exceeds 80%, Kubernetes should add more pods  

Testing the Autoscaler:
- We reset the replica count to `1` and applied the new Helm Chart.  
- Ran another load test with `wrk`.  
- Expected Result Kubernetes should increase the number of pods when CPU usage gets too high.  