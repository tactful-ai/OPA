import express from "express";

import { addRole, removeRole, renameRole } from "../controllers/editRole";
import {
  addResource,
  removeResource,
  saveResourceWith,
} from "../controllers/editResource";
import {
  addPermission,
  removePermission,
  savePermissions,
} from "../controllers/editepermission";
import opalCallback from "../controllers/callback";
import { addTag, getTag } from "../controllers/tag";
import { readdir, updateFiles } from "../controllers/IDE";
const router = express.Router();
// roles
router.post("/roles", addRole);
router.delete("/roles", removeRole);
router.put("/roles", renameRole);

// resources
router.post("/resources", addResource);
router.delete("/resources", removeResource);
router.put("/resources", saveResourceWith);

//scopes
//router.post("/scopes", saveScopeInResource);
//router.post("/scopes", addScopeToResource);
//router.delete("/scopes", removeScopeFromResource);

// permissions
router.post("/permissions", addPermission);
router.post("/permissions/all", savePermissions);
router.delete("/permissions", removePermission);

//callback
router.post("/opalCallback", opalCallback);

//tag
router.post("/tags", addTag);
router.get("/tags", getTag);

//IDE
router.get("/readdir", readdir);
router.put("/file", updateFiles);

export default router;
