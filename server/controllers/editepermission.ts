// Import required libraries and modules
require("dotenv").config(); // Load environment variables from .env file
import e, { Request, Response } from "express"; // Express request and response types
import handleAsync from "../utils/handelAsync"; // Custom utility to handle asynchronous functions
import gitManager from "../services/gitManger"; // Custom module for Git management
import fileManger from "../services/fileManger"; // Custom module for file management
import { OPARoleModel } from "../DTO/OPAResponse";
import { resource, role, scope } from "../DTO/types";
import { opalData } from "../DTO/retrieveDTO";
import { checkIfRoleExists } from "./editRole";

// Endpoint handler to add a new resource
const addPermission = handleAsync(async (req: Request, res: Response) => {
  // Pull the latest changes from Git repository
  await gitManager.pull();
  // Read data from a file (presumably containing roles and permissions)
  const data: opalData = await fileManger.read();
  const resource: resource = req.body.resource; // resource to be added
  const scope: scope = req.body.scope; // scopes of the resource
  const role: role = req.body.role; // scopes of the resource

  // Checks
  if (!data.resources[resource]) {
    return res.status(400).json({ message: "resource does not exist" });
  }
  if (!data.resources[resource].includes(scope)) {
    return res.status(400).json({ message: "scope does not exist" });
  }
  if (!checkIfRoleExists(data.roles, role)) {
    return res.status(400).json({ message: "role does not exist" });
  }

  //edit the permission
  if (!data.permissions[resource]) {
    data.permissions[resource] = { [scope]: [role] };
  } else if (!data.permissions[resource][scope]) {
    data.permissions[resource][scope] = [role];
  } else if (!data.permissions[resource][scope].includes(role)) {
    data.permissions[resource][scope].push(role);
  } else {
    return res.status(400).json({ message: "permission already exists" });
  }

  // Write updated data back to the file
  await fileManger.write(data);
  // Push changes to Git repository with a commit message
  await gitManager.push(
    "role " + role + " allow to " + scope + " in " + resource + " resource"
  );
  return res.json({ message: "permission added successfully" });
});

const removePermission = handleAsync(async (req: Request, res: Response) => {
  // Pull the latest changes from Git repository
  await gitManager.pull();
  // Read data from a file (presumably containing roles and permissions)
  const data: opalData = await fileManger.read();
  const resource: resource = req.body.resource; // resource to be added
  const scope: scope = req.body.scope; // scopes of the resource
  const role: role = req.body.role; // scopes of the resource

  // Checks
  if (!data.resources[resource]) {
    return res.status(400).json({ message: "resource does not exist" });
  }
  if (!data.resources[resource].includes(scope)) {
    return res.status(400).json({ message: "scope does not exist" });
  }
  if (!checkIfRoleExists(data.roles, role)) {
    return res.status(400).json({ message: "role does not exist" });
  }

  //edit the permission
  if (data.permissions[resource] && data.permissions[resource][scope]) {
    data.permissions[resource][scope] = data.permissions[resource][
      scope
    ].filter((permissionRole: string) => permissionRole !== role);
  } else {
    return res.status(400).json({ message: "permission does not exist" });
  }

  // Write updated data back to the file
  await fileManger.write(data);
  // Push changes to Git repository with a commit message
  await gitManager.push(
    "role " + role + " not allow to " + scope + " in " + resource + " resource"
  );
  return res.json({ message: "permission removed successfully" });
});

export { addPermission, removePermission };
