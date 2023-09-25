// Import required libraries and modules
require("dotenv").config(); // Load environment variables from .env file
import e, { Request, Response } from "express"; // Express request and response types
import gitManager from "../services/gitManger"; // Custom module for Git management
import fileManger from "../services/fileManger"; // Custom module for file management
import { resource, role, scope } from "../DTO/types";
import { opalData } from "../DTO/retrieveDTO";
import { checkIfRoleExists } from "./editRole";
import { lockOpalCallback, waitUntilOpalUnlocked } from "../services/lock";
import runOPATestWrapper from "../services/runTest";
import handleMutexAsync from "../utils/handleMutexAsync";

// Endpoint handler to edit permissions
const savePermissions = handleMutexAsync(
  async (req: Request, res: Response) => {
    // Pull the latest changes from Git repository
    await gitManager.pull();
    // Read data from a file (presumably containing roles and permissions)
    let data: opalData = await fileManger.readData();

    const permissions = req.body.permissions;

    //edit the permission
    for (let i = 0; i < permissions.length; i++) {
      const permission = permissions[i];
      if (permission.type === "add") {
        data = addPermissionLogic(
          data,
          permission.resource,
          permission.scope,
          permission.role
        );
      } else if (permission.type === "remove") {
        data = RemovePermissionLogic(
          data,
          permission.resource,
          permission.scope,
          permission.role
        );
      }
    }

    // Write updated data back to the file
    await fileManger.writeData(data);
    if (!(await runOPATestWrapper())) {
      return res.status(400).json({ message: "test failed" });
    }
    lockOpalCallback();
    // Push changes to Git repository with a commit message
    await gitManager.push("change permissions");
    await waitUntilOpalUnlocked();
    return res.json({ message: "permission saved successfully" });
  }
);

// Endpoint handler to only add one permission
const addPermission = handleMutexAsync(async (req: Request, res: Response) => {
  // Pull the latest changes from Git repository
  await gitManager.pull();
  // Read data from a file (presumably containing roles and permissions)
  let data: opalData = await fileManger.readData();
  const resource: resource = req.body.resource; // resource to be added
  const scope: scope = req.body.scope; // scopes of the resource
  const role: role = req.body.role; // scopes of the resource

  // Checks
  checks(data, resource, scope, role);

  //edit the permission
  data = addPermissionLogic(data, resource, scope, role);

  // Write updated data back to the file
  await fileManger.writeData(data);

  if (!(await runOPATestWrapper())) {
    return res.status(400).json({ message: "test failed" });
  }
  lockOpalCallback();
  // Push changes to Git repository with a commit message
  await gitManager.push(
    "role " + role + " allow to " + scope + " in " + resource + " resource"
  );
  await waitUntilOpalUnlocked();
  return res.json({ message: "permission added successfully" });
});

// Endpoint handler to only remove one permission
const removePermission = handleMutexAsync(
  async (req: Request, res: Response) => {
    // Pull the latest changes from Git repository
    await gitManager.pull();
    // Read data from a file (presumably containing roles and permissions)
    let data: opalData = await fileManger.readData();
    const resource: resource = req.body.resource; // resource to be added
    const scope: scope = req.body.scope; // scopes of the resource
    const role: role = req.body.role; // scopes of the resource

    // Checks
    checksForDelete(data, resource, scope, role);

    //edit the permission
    data = RemovePermissionLogic(data, resource, scope, role);

    // Write updated data back to the file
    await fileManger.writeData(data);
    // Run OPA test
    if (!(await runOPATestWrapper())) {
      return res.status(400).json({ message: "test failed" });
    }
    lockOpalCallback();
    // Push changes to Git repository with a commit message
    await gitManager.push(
      "role " +
        role +
        " not allow to " +
        scope +
        " in " +
        resource +
        " resource"
    );
    await waitUntilOpalUnlocked();
    return res.json({ message: "permission removed successfully" });
  }
);

const checks = (
  data: opalData,
  resource: resource,
  scope: scope,
  role: role
) => {
  if (!data.resources[resource]) {
    throw new Error("resource does not exist");
  }
  if (!data.resources[resource].includes(scope)) {
    throw new Error("scope does not exist");
  }
  if (!checkIfRoleExists(data.roles, role)) {
    throw new Error("role does not exist");
  }
};
const checksForDelete = (
  data: opalData,
  resource: resource,
  scope: scope,
  role: role
) => {
  checks(data, resource, scope, role);
  if (!data.permissions[resource]) {
    throw new Error("permission does not exist");
  } else if (!data.permissions[resource][scope]) {
    throw new Error("permission does not exist");
  } else if (!data.permissions[resource][scope].includes(role)) {
    throw new Error("permission does not exist");
  }
};

const addPermissionLogic = (
  data: opalData,
  resource: resource,
  scope: scope,
  role: role
) => {
  checks(data, resource, scope, role);

  //edit the permission
  if (!data.permissions[resource]) {
    data.permissions[resource] = { [scope]: [role] };
  } else if (!data.permissions[resource][scope]) {
    data.permissions[resource][scope] = [role];
  } else if (!data.permissions[resource][scope].includes(role)) {
    data.permissions[resource][scope].push(role);
  } else {
    throw new Error("permission already exists");
  }
  return data;
};

const RemovePermissionLogic = (
  data: opalData,
  resource: resource,
  scope: scope,
  role: role
) => {
  //edit the permission
  if (data.permissions[resource] && data.permissions[resource][scope]) {
    data.permissions[resource][scope] = data.permissions[resource][
      scope
    ].filter((permissionRole: string) => permissionRole !== role);
  } else {
    throw new Error("permission does not exist");
  }
  return data;
};

export { savePermissions, addPermission, removePermission };
