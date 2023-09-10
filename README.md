# Open Policy Agent (OPA)

**Open Policy Agent (OPA)** is an open-source policy engine designed for policy-based control and decision-making in modern, cloud-native applications. It provides a unified, declarative language for expressing policies across different layers of your software stack.

## Key Features

- **Declarative Policies**: OPA allows you to express policies using a high-level, human-readable language called Rego (Policy Language) rather than writing complex code.

- **Fine-Grained Control**: OPA enables fine-grained control over authorization and access control, making it suitable for microservices and containerized environments.

- **Policy as Code**: You can version, test, and manage policies as code, making it easier to maintain and enforce complex security and compliance requirements.

- **Integration Flexibility**: OPA can be integrated with various cloud-native tools, services, and APIs, making it versatile for enforcing policies in different environments.

## Use Cases

1. **Access Control**: OPA helps define and enforce access control policies, ensuring that only authorized users or services can access specific resources.

2. **Authorization**: It allows you to determine whether a given request or action is authorized based on defined policies.

3. **Data Filtering**: OPA can filter and transform data in real-time, enabling data-driven policy decisions.

4. **Compliance and Security**: OPA can enforce security and compliance policies, ensuring that your applications adhere to organizational standards and best practices.

## How OPA Works

OPA evaluates policies against incoming requests or data. It can be integrated into your application's code or deployed as a standalone service. When a request or data is sent to OPA, it uses the defined policies to make access control and authorization decisions.


# About OPAL: Real-time Policy and Data Aggregation

About OPAL, an open-source project developed by permit io. OPAL was initially designed to be an integral part of the permit.io website. Its primary aim is to facilitate real-time aggregation of Open Policy Agent (OPA) policies and data using real-time WebSockets. The core architecture of OPAL consists of three main components: the OPAL server, OPAL client, and broadcast channel.

## Key Components

- **OPAL Server:** The OPAL server acts as the central synchronization hub for all agents. It enables seamless distribution of updates to agents without directly transmitting the data. Instead, the server provides the resource location from which the OPAL client can retrieve the data. This approach is particularly advantageous for efficiently managing and distributing large datasets.

- **OPAL Client:** Responsible for maintaining up-to-date OPA policies and data, the OPAL client operates in the background. It ensures that the OPA instances are consistently aligned with the latest changes, enhancing the overall accuracy of policy enforcement.

- **Broadcast Channel:** The broadcast channel establishes a connection bridge between the OPAL client and OPAL server. It facilitates efficient transmission of updates, ensuring that policy and data changes are promptly delivered and applied.

## Features and Advantages

- **Data Sharding:** OPAL supports data sharding, allowing efficient division and management of data. This feature is particularly useful for handling extensive datasets, ensuring streamlined storage and retrieval.

- **Low Latency:** With a focus on minimal latency, OPAL ensures swift propagation of policy and data updates throughout the system. This is crucial for maintaining the real-time nature of policy enforcement.

- **CLI Tools:** Both the OPAL server and OPAL client come with command-line interface (CLI) tools, simplifying various management, configuration, and monitoring tasks.

- **Git Repository Sync:** OPAL's integration with Git repositories enhances version control for policies, streamlining collaboration and providing a history of policy modifications.

## Workflow and Change Management

OPAL provides versatile methods to accommodate changes and updates:

1. **API-based Data Changes:** OPAL supports API-based changes specifically for data updates. Through the API interface, you can programmatically modify data, offering flexibility and automation in data management.

2. **Git Repository Tracking:** For managing data and policy changes, OPAL supports tracking data and policy modifications via Git repositories. By monitoring repository commits and updates, OPAL ensures that data and policies remain synchronized with the latest changes.

## Robustness and Resilience

In cases of network disruptions, the OPAL client implements a fail-safe mechanism. Upon reconnection, it refetch all changes and updates from the OPAL server, guaranteeing that no critical updates are missed.

## OPAL Architecture  

![](https://camo.githubusercontent.com/cd8cec2e446f8e72b14b19f34ee646264aad82372b22f4898a6a36374e6c228e/68747470733a2f2f692e6962622e636f2f43766d583872522f73696d706c69666965642d6469616772616d2d686967686c696768742e706e67)

![Alt text](https://github.com/tactful-ai/OPA/blob/dev/Wiki%20Data/Readme%20file/arch.png?raw=true)




-----------

# OPAL Manager Setup Guide

This guide provides comprehensive instructions for setting up and running the OPAL along with the accompanying Node.js server. OPAL enables real-time management policies.

## Prerequisites

To get started, ensure you have the following prerequisites installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for running the Node.js server)


## Configurations
 **OPAL**:
  - Edit the `server/docker-compose.yaml` :
   ```bash
   cd server
   nano docker-compose.yaml
   ```
   - Set the following environment variables inside OPAL server:
   ```yaml
   environment:
     - OPAL_POLICY_REPO_URL: <your_rego_code_repo_url>
     - OPAL_POLICY_REPO_WEBHOOK_SECRET: <your_webhook_secret>
     - OPAL_POLICY_REPO_MAIN_BRANCH: branch that opal will track
     - OPAL_POLICY_REPO_WEBHOOK_PARAMS: webhook parameter

   ```
[webhook parameter](https://docs.opal.ac/tutorials/track_a_git_repo#example-configuration-values-for-common-services)
   - Set the following environment variables inside OPAL client:
   ```yaml
   environment:
     - OPAL_POLICY_STORE_URL: OPA url
     - OPAL_POLICY_STORE_AUTH_TYPE: TOKEN or OAuth
     - OPAL_POLICY_STORE_AUTH_TOKEN: token to connect to OPA if Authorization layer added to opa
     - OPAL_DEFAULT_UPDATE_CALLBACKS: {"callbacks":["middleware_server_URL"]}
     - OPAL_SHOULD_REPORT_ON_DATA_UPDATES: True
   ```
 **NodeJs server**:
 
 - Open the `server/.env` file in an editor and set the required environment variables:
   ```dotenv
   GIT_REPO=<your_rego_code_repo_url_with_token>
   OPAL_URL=http://opalHostName:7002
   RUN_TESTS=#true or false if you want it to run test before push
   REMOTE_NAME=#the name of the git remote 
   MAIN_BRANCH=#branch that contain the policies
   GIT_EMAIL=#Provide the email address associated with your Git commits. This is used for authorship and identification purposes in Git history.
   DATA_PATH= #path of data file (should be in root)
   PORT: <port_to_run_the_server_default_3000>
   ```

## Step 1: Running OPAL using Docker Compose

1. Clone the OPAL repository:
   ```bash
   git clone https://github.com/tactful-ai/OPA.git
   ```

2. Navigate to the OPAL server directory:
   ```bash
   cd OPA/server
   ```


3. Start OPAL using Docker Compose:
   ```bash
   docker-compose up
   ```

4. OPAL should now be up and running, tracking the specified policy repository.

5. **Webhook Configuration**:
   - Access the settings of your GitHub repository.
   - Go to "Webhooks" or "Hooks" depending on your GitHub version.
   - Add a new webhook:
     - Payload URL: `http://opalHostName:7002/webhook`
     - Content type: `application/json`
     - Secret: Use the same value as `OPAL_POLICY_REPO_WEBHOOK_SECRET`
     - Choose the events you want to trigger the webhook for (e.g., "Push" events).
## Step 2: Running the Node.js Server

1. Navigate to the OPAL server directory:
   ```bash
   cd OPA/server
   ```

2. Install the Node.js server dependencies:
   ```bash
   npm install
   ```

3. Start the Node.js server:
   ```bash
   npm start
   ```

4. The Node.js server should now be running and communicating with the OPAL dashboard.

## Documentation

- Can access full API docs through https://documenter.getpostman.com/view/28376829/2s9Y5WwiNq.

## Permission Management

Managing permissions in OPAL is a straightforward process that empowers you to finely control resource access. Here's a step-by-step guide on how to add a new resource, create a corresponding role, and define permissions:

1. **Adding a New Resource:**
   
   Let's assume you want to add a new resource, like a DB resource, and grant specific access to it.

2. **Creating a New Role - DB-administrator:**

   To enable read and write access to the DB resource, follow these steps:

   - Send a POST request to `/roles`.
   - Include the following JSON data to create a DB-administrator role:

     ```json
     {
        "role": "DB-administrator",
        "description": "Responsible for managing the database"
     }
     ```

3. **Creating the DB Resource:**

   After creating the DB-administrator role, proceed to create the DB resource:

   - Send a POST request to `/resources`.
   - Include the following JSON data to create the DB resource with read and write scopes:

     ```json
     {
        "resource": "DB-resource",
        "scopes": ["read", "write"]
     }
     ```

4. **Defining Permissions:**

   With the role and resource in place, you can define the permissions:

   - To allow the DB-administrator role to read the DB resource:
   
     - Send a POST request to `/permissions`.
     - Include the following JSON data to create a permission for reading:

       ```json
       {
          "resource": "DB-resource",
          "scope": "read",
          "role": "DB-administrator"
       }
       ```

   - To allow the DB-administrator role to write to the DB resource:
   
     - Send another POST request to `/permissions`.
     - Include the following JSON data to create a permission for writing:

       ```json
       {
          "resource": "DB-resource",
          "scope": "write",
          "role": "DB-administrator"
       }
       ```

5. **Congratulations!** You've now configured the permissions. The DB-administrator role can effectively manage and access the DB resource based on the specified permissions.







