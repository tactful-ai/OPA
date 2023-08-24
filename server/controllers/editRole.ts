require("dotenv").config();
import axios from "axios";
import { Request, Response } from "express";
import handleAsync from "../utils/handelAsync";
import gitManager from "../services/gitManger";
import fileManger from "../services/fileManger";

const addRole = handleAsync(async (req: Request, res: Response) => {
  await gitManager.pull();
  const data = await fileManger.read();
  const role = req.body.role;
  if (data.roles.includes(role)) {
    return res.status(400).json({ message: "Role already exist" });
  }
  data.roles.push(role);
  await fileManger.write(data);
  await gitManager.push("add " + role + " role");
  return res.json({ message: "Role added successfully" });
});

const removeRole = handleAsync(async (req: Request, res: Response) => {
  //set-Up
  await gitManager.pull();
  const data = await fileManger.read();
  const removedRole = req.body.role;

  //check if role exist
  if (!data.roles.includes(removedRole)) {
    return res.status(400).json({ message: "Role Not exist" });
  }

  //remove role from all Roles
  data.roles = data.roles.filter((role: string) => role !== removedRole);

  // Remove role from permissions
  for (const resource in data.permissions) {
    for (const action in data.permissions[resource]) {
      data.permissions[resource][action] = data.permissions[resource][
        action
      ].filter((role: string) => role !== removedRole);
    }
  }

  // push changes to git
  await fileManger.write(data);
  await gitManager.push("remove " + removedRole + " role");
  return res.json({ message: "Role removed successfully" });
});

const renameRole = handleAsync(async (req: Request, res: Response) => {
  //set-Up
  await gitManager.pull();
  const data = await fileManger.read();
  const oldRole = req.body.role;
  const newRole = req.body.newRole;

  //check if role exist
  if (!data.roles.includes(oldRole)) {
    return res.status(400).json({ message: "Role Not exist" });
  }
  if (data.roles.includes(newRole)) {
    return res.status(400).json({ message: "new Role already exist" });
  }

  //Rename role in Roles array
  data.roles = data.roles.map((role: string) =>
    role === oldRole ? newRole : role
  );

  // Rename role in permissions
  for (const resource in data.permissions) {
    for (const action in data.permissions[resource]) {
      data.permissions[resource][action] = data.permissions[resource][
        action
      ].map((role: string) => (role === oldRole ? newRole : role));
    }
  }

  // push changes to git
  await fileManger.write(data);
  await gitManager.push("role " + oldRole + " renamed To " + newRole + " role");
  return res.json({ message: "Role renamed successfully" });
});

export { addRole, removeRole, renameRole };
