//import express router

import { Router } from "express";
import {
  retrievePermissions,
  retrieveResources,
  retrieveRoles,
} from "../controllers/retrieve";

const rolesRouter = Router();
rolesRouter.get("/roles", retrieveRoles);
rolesRouter.get("/resources", retrieveResources);
rolesRouter.get("/permissions", retrievePermissions);

export default rolesRouter;
