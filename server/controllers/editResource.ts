// Import required libraries and modules
require("dotenv").config(); // Load environment variables from .env file
import { Request, Response } from "express"; // Express request and response types
import handleAsync from "../utils/handelAsync"; // Custom utility to handle asynchronous functions
import gitManager from "../services/gitManger"; // Custom module for Git management
import fileManger from "../services/fileManger"; // Custom module for file management
import { OPARoleModel } from "../DTO/OPAResponse";
import { resource, scope } from "../DTO/types";
import { opalData } from "../DTO/retrieveDTO";

// Endpoint handler to add a new resource
const addResource = handleAsync(async (req: Request, res: Response) => {
  // Pull the latest changes from Git repository
  await gitManager.pull();
  // Read data from a file (presumably containing roles and permissions)
  const data: opalData = await fileManger.read();

  const resource: resource = req.body.resource; // resource to be added
  const scopes: scope[] = req.body.scopes || []; // scopes of the resource
  // Check if the resource already exists
  if (data.resources[resource]) {
    return res.status(400).json({ message: "resource already exists" });
  }

  // Add the new role to the roles array
  data.resources[resource] = scopes;
  addToScopesArray(data.scopes, scopes);

  // Write updated data back to the file
  await fileManger.write(data);
  // Push changes to Git repository with a commit message
  await gitManager.push("add " + resource + " resource");
  return res.json({ message: "resource added successfully" });
});

// Endpoint handler to remove a resource
const removeResource = handleAsync(async (req: Request, res: Response) => {
  await gitManager.pull(); // Pull the latest changes from Git repository
  const data: opalData = await fileManger.read(); // Read data from a file (presumably containing roles and permissions)
  const resource: resource = req.body.resource; // resource to be added

  // Check if the resource already exists
  if (!data.resources[resource]) {
    return res.status(400).json({ message: "resource does not exist" });
  }

  // delete the resource
  delete data.resources[resource];
  delete data.permissions[resource];

  // Write updated data back to the file
  await fileManger.write(data);
  // Push changes to Git repository with a commit message
  await gitManager.push("removed " + resource + " resource");
  return res.json({ message: "resource removed successfully" });
});

// Endpoint handler to add a scope to resource
const addScopeToResource = handleAsync(async (req: Request, res: Response) => {
  await gitManager.pull(); // Pull the latest changes from Git repository
  const data: opalData = await fileManger.read(); // Read data from a file (presumably containing roles and permissions)
  const resource: resource = req.body.resource;
  const scopes: scope[] = req.body.scopes;
  // Check if the resource already exists
  if (!data.resources[resource]) {
    return res.status(400).json({ message: "resource does not exist" });
  }
  if (
    data.resources[resource].some((scope) => {
      return scopes.includes(scope);
    })
  ) {
    return res.status(400).json({ message: "scope already exists" });
  }
  // add scope to the resource
  scopes.forEach((scope) => data.resources[resource].push(scope));
  addToScopesArray(data.scopes, scopes);
  // Write updated data back to the file
  await fileManger.write(data);
  // Push changes to Git repository with a commit message
  await gitManager.push(
    "scope " + scopes + " added to " + resource + " resource"
  );
  return res.json({ message: "scope added successfully" });
});

const removeScopeFromResource = handleAsync(
  async (req: Request, res: Response) => {
    await gitManager.pull(); // Pull the latest changes from Git repository
    const data: opalData = await fileManger.read(); // Read data from a file (presumably containing roles and permissions)
    const resource: resource = req.body.resource;
    const removedScope: scope = req.body.scope;

    // Check if the resource already exists
    if (!data.resources[resource]) {
      return res.status(400).json({ message: "resource does not exist" });
    }
    if (!data.resources[resource].includes(removedScope)) {
      return res.status(400).json({ message: "scope does not exist" });
    }

    // delete the scope
    data.resources[resource] = data.resources[resource].filter(
      (scope: scope) => scope !== removedScope
    );
    if (data.permissions[resource]) {
      delete data.permissions[resource][removedScope];
    }

    // Write updated data back to the file
    await fileManger.write(data);
    // Push changes to Git repository with a commit message
    await gitManager.push(
      "scope " + removedScope + " added to " + resource + " resource"
    );
    return res.json({ message: "scope removes successfully" });
  }
);

const addToScopesArray = (oldScopes: scope[], newScope: scope[]) => {
  // add new scopes to the old scopes array
  newScope.forEach((scope) => {
    if (!oldScopes.includes(scope)) {
      oldScopes.push(scope);
    }
  });
};

export {
  addResource,
  removeResource,
  removeScopeFromResource,
  addScopeToResource,
};
