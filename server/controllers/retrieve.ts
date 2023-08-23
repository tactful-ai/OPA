require("dotenv").config();
import axios from "axios";
import { Request, Response } from "express";
import handleAsync from "../utils/handelAsync";
import {
  OPAPermissionModel,
  OPAResourceModel,
  OPARoleModel,
} from "../DTO/OPAResponse";
import { PermissionModel, RoleModel, ResourceModel } from "../DTO/retrieveDTO";

const retrieveRoles = handleAsync(
  async (req: Request, res: Response<RoleModel>) => {
    const response = await axios.get(process.env.OPA_URL! + "/v1/data/roles");
    const opaRoleData: OPARoleModel = response.data;
    const roleData = {
      roles: opaRoleData.result,
    };
    console.log(roleData);

    return res.json(roleData);
  }
);

const retrieveResources = handleAsync(
  async (req: Request, res: Response<ResourceModel>) => {
    const response = await axios.get(
      process.env.OPA_URL + "/v1/data/resources"
    );
    const opaResourceDate: OPAResourceModel = response.data;
    const resourcesData = {
      resources: opaResourceDate.result,
    };
    console.log(resourcesData);

    return res.json(resourcesData);
  }
);

const retrievePermissions = handleAsync(
  async (req: Request, res: Response<PermissionModel>) => {
    const response = await axios.get(
      process.env.OPA_URL + "/v1/data/permissions"
    );
    const opaPermissionsData: OPAPermissionModel = response.data;
    const permissionsData = {
      permissions: opaPermissionsData.result,
    };
    console.log(permissionsData);
    return res.json(permissionsData);
  }
);
export { retrieveRoles, retrieveResources, retrievePermissions };
