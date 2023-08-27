// Import required libraries and modules
require("dotenv").config(); // Load environment variables from .env file
import axios from "axios"; // HTTP client library
import { Request, Response } from "express"; // Express request and response types
import handleAsync from "../utils/handelAsync"; // Custom utility to handle asynchronous functions
import {
  PermissionModel,
  RoleModel,
  ResourceModel,
  opalData,
  ScopeModel,
} from "../DTO/retrieveDTO"; // Custom models for retrieved data
import opalManager from "../services/OPALManger";
import { resource, roleWithDescription } from "../DTO/types";

// Endpoint handler to retrieve roles from OPA
const retrieveRoles = handleAsync(
  async (req: Request, res: Response<RoleModel>) => {
    const opalData: opalData = await opalManager.retrieveOPALData();
    const roleData = {
      roles: opalData.roles,
    };
    console.log(roleData);
    return res.json(roleData);
  }
);

const retrieveScopes = handleAsync(
  async (req: Request, res: Response<ScopeModel>) => {
    const opalData: opalData = await opalManager.retrieveOPALData();
    const scopeData = {
      scopes: opalData.scopes,
    };
    console.log(scopeData);
    return res.json(scopeData);
  }
);

// Endpoint handler to retrieve resources from OPA
const retrieveResources = handleAsync(
  async (req: Request, res: Response<ResourceModel>) => {
    // Fetch resources data from OPA API
    const opalData: opalData = await opalManager.retrieveOPALData();
    const resourcesData = {
      resources: opalData.resources,
    };
    console.log(resourcesData);
    return res.json(resourcesData);
  }
);

// Endpoint handler to retrieve permissions from OPA
const retrievePermissions = handleAsync(
  async (req: Request, res: Response<PermissionModel>) => {
    // Fetch permissions data from OPA API
    const opalData: opalData = await opalManager.retrieveOPALData();
    const permissionsData = {
      permissions: opalData.permissions,
    };
    console.log(permissionsData);
    return res.json(permissionsData);
  }
);

// Export the endpoint handler functions
export {
  retrieveRoles,
  retrieveResources,
  retrievePermissions,
  retrieveScopes,
};
