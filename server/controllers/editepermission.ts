// Import required libraries and modules
require("dotenv").config(); // Load environment variables from .env file
import { Request, Response } from "express"; // Express request and response types
import handleAsync from "../utils/handelAsync"; // Custom utility to handle asynchronous functions
import gitManager from "../services/gitManger"; // Custom module for Git management
import fileManger from "../services/fileManger"; // Custom module for file management
import { OPARoleModel } from "../DTO/OPAResponse";
import { resource, role, scope } from "../DTO/types";
import { opalData } from "../DTO/retrieveDTO";
import { checkIfRoleExists } from "./editRole";
import {
  lockOpalCallback,
  unlockOpalCallback,
  waitUntilOpalUnlocked,
} from "../services/lock";
import runOPATestWrapper from "../services/runTest";
import handleMutexAsync from "../utils/handelMutexAsync";

const savePermissions = handleMutexAsync(
  async (req: Request, res: Response) => {
    // Pull the latest changes from Git repository
    await gitManager.pull();
    // Read data from a file (presumably containing roles and permissions)
    let data: opalData = await fileManger.read();

    const permissions = req.body.permissions;
    console.log("🚀 ~ file: editepermission.ts:27 ~ permissions:", permissions);

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
    await fileManger.write(data);
    if (!runOPATestWrapper()) {
      return res.status(400).json({ message: "test failed" });
    }
    lockOpalCallback();
    // Push changes to Git repository with a commit message
    await gitManager.push("change permissions");
    await waitUntilOpalUnlocked();
    return res.json({ message: "permission saved successfully" });
  }
);

// Endpoint handler to add a new resource
const addPermission = handleMutexAsync(async (req: Request, res: Response) => {
  // Pull the latest changes from Git repository
  await gitManager.pull();
  // Read data from a file (presumably containing roles and permissions)
  let data: opalData = await fileManger.read();
  const resource: resource = req.body.resource; // resource to be added
  const scope: scope = req.body.scope; // scopes of the resource
  const role: role = req.body.role; // scopes of the resource

  // Checks
  checks(data, resource, scope, role);

  //edit the permission
  data = addPermissionLogic(data, resource, scope, role);

  // Write updated data back to the file
  await fileManger.write(data);

  if (!runOPATestWrapper()) {
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

const removePermission = handleMutexAsync(
  async (req: Request, res: Response) => {
    // Pull the latest changes from Git repository
    await gitManager.pull();
    // Read data from a file (presumably containing roles and permissions)
    let data: opalData = await fileManger.read();
    const resource: resource = req.body.resource; // resource to be added
    const scope: scope = req.body.scope; // scopes of the resource
    const role: role = req.body.role; // scopes of the resource

    // Checks
    checks(data, resource, scope, role);

    //edit the permission
    data = RemovePermissionLogic(data, resource, scope, role);

    // Write updated data back to the file
    await fileManger.write(data);
    // Run OPA test
    if (!runOPATestWrapper()) {
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
  checks(data, resource, scope, role);
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
