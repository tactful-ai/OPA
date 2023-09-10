import { roleWithDescription, role, resource, scope } from "./types";

// models/RoleModel.ts
interface RoleModel {
  roles: roleWithDescription[];
}
interface ScopeModel {
  scopes: scope[];
}
// models/ResourceModel.ts
interface ResourceModel {
  resources: Record<resource, scope[]>;
}


type ResourcePermissions = Record<scope, role[]>;

// models/PermissionModel.ts
interface PermissionModel {
  permissions: Record<resource, ResourcePermissions>;
}
interface opalData {
  roles: roleWithDescription[];
  resources: Record<resource, scope[]>;
  scopes: scope[];
  permissions: Record<resource, Record<scope, role[]>>;
}
export {
  RoleModel,
  ResourceModel,
  PermissionModel,
  opalData,
  ScopeModel,
  ResourcePermissions,
};
