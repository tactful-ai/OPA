// routes/opa.ts
import express from "express";
import {
  retrieveRoles,
  retrieveResources,
  retrievePermissions,
} from "../controllers/retrieve";
const router = express.Router();

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Retrieve roles from OPA
 *     responses:
 *       200:
 *         description: Returns the list of roles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleModel'
 *             example:
 *               roles: ["admin", "user", "guest"]
 */
router.get("/roles", retrieveRoles);

/**
 * @swagger
 * /resources:
 *   get:
 *     summary: Retrieve resources from OPA
 *     responses:
 *       200:
 *         description: Returns the list of resources
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResourceModel'
 *             example:
 *               resources:
 *                 book: ["read", "order", "review"]
 *                 document: ["read", "order", "review"]
 *                 email: ["read", "send"]
 */
router.get("/resources", retrieveResources);

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Retrieve permissions from OPA
 *     responses:
 *       200:
 *         description: Returns the permissions mapping
 *
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionModel'
 *             example:
 *               permissions:
 *                 book:
 *                   read: ["user", "guest"]
 *                   order: ["user"]
 *                   review: ["user"]
 *                 document:
 *                   read: ["user", "guest"]
 *                   order: ["user"]
 *                   review: ["user"]
 *                 email:
 *                   read: ["user", "guest"]
 *                   send: ["user"]
 */

router.get("/permissions", retrievePermissions);

export default router;
