# Sprint 1 Demo

# Abstract

The Open Policy Agent is an open-source, general-purpose policy engine that unifies policy enforcement across the stack. OPA [decouples](https://www.openpolicyagent.org/docs/latest/philosophy#policy-decoupling) policy decision-making from policy enforcement and application logic. At Dstny Engage, making changes to permissions in the OPA service is a cumbersome and time-consuming process that requires modifying code and deploying it. This is due to the deployment of several microservices and the need for the open policy agent to authorize the interactions between them.

This project aims to develop a centralized dashboard and a server that acts as a middleware between the microservices and the open policy agent, allowing for user-friendly policy modifications in real-time.

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled.png)

---

# Market Survey

Surveying the market for similar solutions, the following are the ones we have drawn the most inspiration from:

add some screenshots

- [Permit.io](http://permit.io/)

Permit.io offers low-code solutions to secure APIs from the frontend, enforce ABAC, and provide out-of-the-box access control elements you can embed directly into your app.

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%201.png)

- [Styra Das](https://www.styra.com/styra-das/)

Created by the developers of OPA, Styra DAS acts as a central control plane for all OPA agents distributed over various microservices. Each agent can act autonomously, and the central control plane (Styra DAS) receives telemetry data and logs from agents and pushes the latest configurations.

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%202.png)

- [Oso](https://www.osohq.com/)

A batteries-included system for building authorization in your application. Similar to OPA, the Oso authorization library uses the **Polar programming language** to express authorization logic and policies, with libraries that currently support Python, Node.js, Ruby, Go, Java, and Rust.

---

# Features and Use Cases

Change NodeServer → Middleware

We will now illustrate our ideas for the features and use cases we need to implement to achieve an MVP for this project. We will go over a description of several use cases, explain their sequence and dataflow diagrams, and finally show a mockup wireframe of their frontend

```json
{
  "data": {
    "roles": ["admin", "writer"],
"scopes":["create", "delete", "update"] 
    "permissions": {
      "email": {
        "create": ["admin"],
        "update": ["admin", "writer"]
    }
  }
}
```

## 1. User login and SSO

| Name | Access to the dashboard |
| --- | --- |
| Description | Integrate  SSO with the dashboard |
| User Type/Name | Admins - Moderators |

Completing this feature requires us to retrieve the role of the current user to check his modifying capabilities.

## 2. Displaying Available Roles

| Name | Display Roles |
| --- | --- |
| Description | Need to implement a UI to properly display available roles and their descriptions |
| User Type | Admins - Moderators |
| UI Flow | Role Viewing |

### Backend

1. Create a backend endpoint that retrieves role data from Open Policy Agent (OPA).
2. Configure the endpoint to make a GET request to OPA for role data and respond with the received data.

### Sequence Diagram

![Screenshot 2023-08-15 101808.png](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Screenshot_2023-08-15_101808.png)

### Dataflow Diagram

![Screenshot 2023-08-15 105529.png](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Screenshot_2023-08-15_105529.png)

### Wireframe

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%203.png)

## 3. Displaying the available resources and their scopes

Scopes are the available actions that can be applied on any resource

| Name | Display resources and their scopes |
| --- | --- |
| Description | Need to implement a UI to properly display available recourses and their scopes. |
| User Type/Name | Developers, Admins and Moderator |
| UI Flow | Resource Viewing - also shows actions and attributes |

### Backend

1. Create a backend endpoint that retrieves Resources data from Open Policy Agent (OPA).
2. Configure the endpoint to make a GET request to OPA for resources data and respond with the received data.
3. Create a backend endpoint that retrieves role data from Open Policy Agent (OPA).
4. Configure the endpoint to make a GET request to OPA for role data and respond with the received data. data and respond with the received data.

### Sequence Diagram

![Screenshot 2023-08-15 102350.png](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Screenshot_2023-08-15_102350.png)

### Dataflow Diagram

![Screenshot 2023-08-15 110242.png](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Screenshot_2023-08-15_110242.png)

### Wireframe

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%204.png)

## 4. Display the current permissions

| Name | Display permission |
| --- | --- |
| Description | Need to implement a UI to properly display available permissions and the involved roles and resources |
| User Type/Name | Developers, Admins and Moderator |
| UI Flow | Policy Editing - A table with resource scopes as rows and roles as columns using inactive checkboxes as indicators |

### Sequence Diagram

![Screenshot 2023-08-15 102502.png](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Screenshot_2023-08-15_102502.png)

### Dataflow Diagram

![Screenshot 2023-08-15 112744.png](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Screenshot_2023-08-15_112744.png)

### Wireframe

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%205.png)

## 5. Adding/Modifying an Existing Role

| Name | (Add Delete update)  role |
| --- | --- |
| Description | Need to implement a UI to properly (Add Delete update)  role |
| User Type/Name | Admins - Moderators |
| UI Flow | Role Creation |
| Non-functional requirements | Reflect change to the data store in real time in no more than 5 minutes |

```json
PUT POST DELETE  api/v1/role
{
	"roleNeme": "",
	"newRoleName":"" (if req is put)
}
```

### Sequence Diagram

![Screenshot 2023-08-14 200534.png](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Screenshot_2023-08-14_200534.png)

### Dataflow Diagram

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%206.png)

### Wireframe

The wireframes for adding and modifying are almost identical, with the exception of retrieving existing data when modifying a role

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%207.png)

## 6. Adding/Modifying an existing Resource

| Name | Add/Delete/Update Resource |
| --- | --- |
| User Type/Name | Admins - Moderators |
| Description | Need to implement a UI to properly (Add and Delete updated) resources  |
| UI Flow | Resource Creation |
| Non-functional requirements | Reflect change to the data store in real time in no more than 5 minutes |

### Sequence Diagram

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%208.png)

### Dataflow Diagram

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%209.png)

### Wireframe

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%2010.png)

## 7. Adding/Modifying an action linked to a resource

| Name | (Add Delete update) scope (action) |
| --- | --- |
| Description | Need to implement a UI to properly (Add Delete update) scope   |
| User Type/Name | Admins - Moderators |
| UI Flow | New Action - Actions are linked to resources , and thus adding /updating an action will be accessible from the resources tab |
| Non-functional requirements | Reflect change to the data store in real time in no more than 5 minutes |

### Sequence Diagram

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%2011.png)

### Dataflow Diagram

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%2012.png)

### Wireframe

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%2013.png)

## 8. Adding/Modifying a Permission

Permissions are rules or, more formally, policies that lets a role (subject) do an action (scope) on a resource (object).

| Name | (Add Delete update) permission.    |
| --- | --- |
| Description | Need to implement a UI to properly  (Add Delete update) permission  |
| User Type/Name | Admins - Moderators |
| UI Flow | Policy Editing - Table is interactive, with checkboxes to add or delete permissions |
| Non-functional requirements | Reflect change to the data store in real time in no more than 5 minutes |

### Sequence Diagram

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%2014.png)

### Dataflow Diagram

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%2015.png)

### Wireframe

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%2016.png)

---

# Timeline

![Untitled](Sprint%201%20Demo%201f37cb94808e4b4bbeaf80cae2119deb/Untitled%2017.png)

---

# Technology

Backend: Node.js, OPA, GitHub Actions

Frontend: Vue.js