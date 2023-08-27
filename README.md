

# OPAL RBAC Manager Setup Guide

This guide provides comprehensive instructions for setting up and running the OPAL RBAC manager along with the accompanying Node.js server. OPAL enables real-time management of RBAC (Role-Based Access Control) policies using an open-source project.

## Prerequisites

To get started, ensure you have the following prerequisites installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for running the Node.js server)

## Step 1: Running OPAL using Docker Compose

1. Clone the OPAL repository:
   ```bash
   git clone https://github.com/tactful-ai/OPA.git
   ```

2. Navigate to the OPAL server directory:
   ```bash
   cd OPA/server
   ```

3. Edit the `docker-compose.yaml` file:
   ```bash
   nano docker-compose.yaml
   ```
   Set the following environment variables:
   ```yaml
   environment:
     OPAL_POLICY_REPO_URL: <your_rego_code_repo_url>
     OPAL_POLICY_REPO_WEBHOOK_SECRET: <your_webhook_secret>
   ```

4. Start OPAL using Docker Compose:
   ```bash
   docker-compose up
   ```

5. OPAL should now be up and running, tracking the specified policy repository.

6. **Webhook Configuration**:
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

2. Create a `.env` file in the server directory:
   ```bash
   touch .env
   ```

3. Open the `.env` file in an editor and set the required environment variables:
   ```dotenv
   GIT_REPO=<your_rego_code_repo_url_with_token>
   OPAL_URL=http://opalHostName:7002
   PORT: <port_to_run_the_server_default_3000>
   ```

4. Install the Node.js server dependencies:
   ```bash
   npm install
   ```

5. Start the Node.js server:
   ```bash
   npm start
   ```

6. The Node.js server should now be running and communicating with the OPAL dashboard.

## Usage

- Access node server and configure RBAC policies in real-time.
- The Node.js server communicates with the OPAL dashboard and provides higher-level functionalities.

## Conclusion

Congratulations! You've successfully set up and configured the OPAL RBAC manager and the Node.js server. You can now manage RBAC policies in real-time


