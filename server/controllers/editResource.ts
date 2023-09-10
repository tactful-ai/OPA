// Import required libraries and modules
require("dotenv").config(); // Load environment variables from .env file
import { Request, Response } from "express"; // Express request and response types
import handleAsync from "../utils/handelAsync"; // Custom utility to handle asynchronous functions
import gitManager from "../services/gitManger"; // Custom module for Git management
import fileManger from "../services/fileManger"; // Custom module for file management
import { PermissionModel, ResourcePermissions } from "../DTO/retrieveDTO";
import { resource, scope } from "../DTO/types";
import { opalData } from "../DTO/retrieveDTO";
import runOPATest from "../services/runTest";
import { lockOpalCallback, waitUntilOpalUnlocked } from "../services/lock";
import handleMutexAsync from "../utils/handelMutexAsync";
import runOPATestWrapper from "../services/runTest";

// Endpoint handler to add a new resource
const addResource = handleMutexAsync(async (req: Request, res: Response) => {
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

  // Add the new resource t
  data.resources[resource] = scopes;
  addToScopesArray(data.scopes, scopes);

  // Write updated data back to the file
  await fileManger.write(data);

  if (!runOPATestWrapper()) {
    return res.status(400).json({ message: "test failed" });
  }

  lockOpalCallback();
  // Push changes to Git repository with a commit message
  await gitManager.push("add " + resource + " resource");
  await waitUntilOpalUnlocked();
  return res.json({ message: "resource added successfully" });
});

// Endpoint handler to remove a resource
const removeResource = handleMutexAsync(async (req: Request, res: Response) => {
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

  if (!runOPATestWrapper()) {
    return res.status(400).json({ message: "test failed" });
  }
  lockOpalCallback();
  // Push changes to Git repository with a commit message
  await gitManager.push("removed " + resource + " resource");
  await waitUntilOpalUnlocked();
  return res.json({ message: "resource removed successfully" });
});

// Endpoint handler to add a scope to resource
const saveResourceWith = handleMutexAsync(
  async (req: Request, res: Response) => {
    await gitManager.pull(); // Pull the latest changes from Git repository

    // Read data from a file (presumably containing roles and permissions)
    const data: opalData = await fileManger.read();
    //get the data from the request
    let resource: resource = req.body.resource;
    const newScopes: scope[] = req.body.scopes;
    const newResource: resource = req.body.newResource;

    // Check if the resource already exists
    if (!data.resources[resource]) {
      return res.status(400).json({ message: "resource does not exist" });
    }
    //
    if (newResource) {
      data.resources[newResource] = data.resources[resource];
      delete data.resources[resource];

      data.permissions[newResource] = data.permissions[resource];
      delete data.permissions[resource];
    }
    resource = newResource || resource;

    // scopes already in the resource
    const initScopes = data.resources[resource];

    // scope to be added to the resource
    const scopesToBeAdded = newScopes.filter(
      (item) => !initScopes.includes(item)
    );

    // scopes to be removed from the resource
    const scopesToBeRemoved = initScopes.filter(
      (item) => !newScopes.includes(item)
    );

    // add scope to the resource
    addScopesToResource(data.resources[resource], scopesToBeAdded, data.scopes);

    data.resources[resource] = RemoveScopesFromResource(
      data.resources[resource],
      scopesToBeRemoved,
      data.permissions[resource]
    );

    await fileManger.write(data);

    if (!runOPATestWrapper()) {
      return res.status(400).json({ message: "test failed" });
    }
    lockOpalCallback();
    await gitManager.push(resource + " resource scopes edited ");
    await waitUntilOpalUnlocked();
    return res.json({ message: "scope edit successfully" });
  }
);

const addScopesToResource = (
  oldScopes: scope[],
  scopesToBeAdded: scope[],
  AllScopes: scope[]
) => {
  // add scope to the resource
  scopesToBeAdded.forEach((scope) => oldScopes.push(scope));
  addToScopesArray(AllScopes, scopesToBeAdded);
};

const RemoveScopesFromResource = (
  oldScopes: scope[],
  scopesToRemoved: scope[],
  permission: ResourcePermissions
) => {
  scopesToRemoved.forEach((removedScope) => {
    oldScopes = oldScopes.filter((scope: scope) => scope !== removedScope);
    if (permission) {
      delete permission[removedScope];
    }
  });
  return oldScopes;
};

// Endpoint handler to add a scope to resource
/* const addScopeToResource = handleAsync(async (req: Request, res: Response) => {
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
}); */

/* const removeScopeFromResource = handleAsync(
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
); */

const addToScopesArray = (oldScopes: scope[], newScope: scope[]) => {
  // add new scopes to the old scopes array
  newScope.forEach((scope) => {
    if (!oldScopes.includes(scope)) {
      oldScopes.push(scope);
    }
  });
};

export { addResource, removeResource, saveResourceWith };
