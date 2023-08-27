// Import required libraries and modules
require("dotenv").config(); // Load environment variables from .env file
import { Request, Response } from "express"; // Express request and response types
import handleAsync from "../utils/handelAsync"; // Custom utility to handle asynchronous functions
import gitManager from "../services/gitManger"; // Custom module for Git management
import fileManger from "../services/fileManger"; // Custom module for file management
import { OPARoleModel } from "../DTO/OPAResponse";
import { description, role, roleWithDescription } from "../DTO/types";

// Endpoint handler to add a new role
const addRole = handleAsync(async (req: Request, res: Response) => {
  // Pull the latest changes from Git repository
  await gitManager.pull();
  // Read data from a file (presumably containing roles and permissions)
  const data = await fileManger.read();
  const role: role = req.body.role; // Role to be added
  const description: description = req.body.description; // Description of the role
  const roleData: roleWithDescription = {
    role,
    description,
  };
  // Check if the role already exists
  if (checkIfRoleExists(data.roles, role)) {
    return res.status(400).json({ message: "Role already exists" });
  }

  // Add the new role to the roles array
  data.roles.push(roleData);
  // Write updated data back to the file
  await fileManger.write(data);
  // Push changes to Git repository with a commit message
  await gitManager.push("add " + role + " role");
  return res.json({ message: "Role added successfully" });
});

// Endpoint handler to remove a role
const removeRole = handleAsync(async (req: Request, res: Response) => {
  // Pull the latest changes from Git repository
  await gitManager.pull();
  // Read data from a file
  const data = await fileManger.read();
  const removedRole: role = req.body.role; // Role to be removed

  // Check if the role exists
  if (!checkIfRoleExists(data.roles, removedRole)) {
    return res.status(400).json({ message: "Role does not exist" });
  }

  // Remove the role from the roles array
  data.roles = data.roles.filter(
    (roleWithDescription: roleWithDescription) =>
      roleWithDescription.role !== removedRole
  );

  // Remove the role from permissions in various resources
  for (const resource in data.permissions) {
    for (const scope in data.permissions[resource]) {
      data.permissions[resource][scope] = data.permissions[resource][
        scope
      ].filter((role: string) => role !== removedRole);
    }
  }

  // Write updated data back to the file
  await fileManger.write(data);
  // Push changes to Git repository with a commit message
  await gitManager.push("remove " + removedRole + " role");
  return res.json({ message: "Role removed successfully" });
});

// Endpoint handler to rename a role
const renameRole = handleAsync(async (req: Request, res: Response) => {
  // Pull the latest changes from Git repository
  await gitManager.pull();
  // Read data from a file
  const data = await fileManger.read();
  const oldRole: role = req.body.role; // Old role name
  const newRole: role = req.body.newRole; // New role name

  // Check if the old role exists
  if (!checkIfRoleExists(data.roles, oldRole)) {
    return res.status(400).json({ message: "Role does not exist" });
  }
  // Check if the new role name already exists
  if (checkIfRoleExists(data.roles, newRole)) {
    return res.status(400).json({ message: "New role already exists" });
  }

  // Rename the role in the roles array
  data.roles = data.roles.map((roleWithDescription: roleWithDescription) =>
    roleWithDescription.role === oldRole ? newRole : roleWithDescription.role
  );

  // Rename the role in permissions for various resources
  for (const resource in data.permissions) {
    for (const scope in data.permissions[resource]) {
      data.permissions[resource][scope] = data.permissions[resource][scope].map(
        (role: string) => (role === oldRole ? newRole : role)
      );
    }
  }

  // Write updated data back to the file
  await fileManger.write(data);
  // Push changes to Git repository with a commit message
  await gitManager.push("role " + oldRole + " renamed to " + newRole + " role");
  return res.json({ message: "Role renamed successfully" });
});

const checkIfRoleExists = (resource: roleWithDescription[], role: role) => {
  for (let i = 0; i < resource.length; i++) {
    if (role == resource[i].role) return true;
  }
  return false;
};

// Export the endpoint handler functions
export { addRole, removeRole, renameRole, checkIfRoleExists };
