import express from "express";

import { addRole, removeRole, renameRole } from "../controllers/editRole";
const router = express.Router();

router.post("/roles", addRole);
router.delete("/roles", removeRole);
router.put("/roles", renameRole);

export default router;
