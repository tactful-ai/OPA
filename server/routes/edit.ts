import express from "express";

import { addRole, removeRole, renameRole } from "../controllers/editRole";
import {
  addResource,
  addScopeToResource,
  removeResource,
  removeScopeFromResource,
} from "../controllers/editResource";
import {
  addPermission,
  removePermission,
} from "../controllers/editepermission";
const router = express.Router();
// roles
router.post("/roles", addRole);
router.delete("/roles", removeRole);
router.put("/roles", renameRole);

// resources
router.post("/resources", addResource);
router.delete("/resources", removeResource);

//scopes
router.post("/scopes", addScopeToResource);
router.delete("/scopes", removeScopeFromResource);

// permissions
router.post("/permissions", addPermission);
router.delete("/permissions", removePermission);


export default router;
