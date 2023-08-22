//import request response from express

require("dotenv").config();

import axios from "axios";
import { Request, Response } from "express";
import handleAsync from "../utils/handelAsync";
console.log(process.env.OPA_URL);

const retrieveRoles = handleAsync(async (req: Request, res: Response) => {
  const Data = await axios.get(process.env.OPA_URL! + "/v1/data/roles");
  const roleData = {
    roles: Data.data.result,
  };
  console.log(roleData);

  return res.json(roleData);
});

const retrieveResources = handleAsync(async (req: Request, res: Response) => {
  const Data = await axios.get(process.env.OPA_URL + "/v1/data/resources");
  const resourcesData = {
    resources: Data.data.result,
  };
  console.log(resourcesData);

  return res.json(resourcesData);
});

//export retrieveRolesfunction to be used in other files module.

const retrievePermissions = handleAsync(async (req: Request, res: Response) => {
  const Data = await axios.get(process.env.OPA_URL + "/v1/data/permissions");
  const permissionsData = {
    permissions: Data.data.result,
  };
  console.log(permissionsData);

  return res.json(permissionsData);
});
export { retrieveRoles, retrieveResources, retrievePermissions };
