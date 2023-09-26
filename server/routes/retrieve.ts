// routes/opa.ts
import express from "express";
import {
  retrieveRoles,
  retrieveResources,
  retrievePermissions,
  retrieveScopes,
} from "../controllers/retrieve";
const router = express.Router();


router.get("/roles", retrieveRoles);
router.get("/resources", retrieveResources);
router.get("/scopes", retrieveScopes);
router.get("/permissions", retrievePermissions);

export default router;
