import { roleWithDescription, role, resource, scope } from "./types";

// models/RoleModel.ts
interface OPARoleModel {
  result: roleWithDescription[];
}

// models/ResourceModel.ts
interface OPAResourceModel {
  result: Record<resource, scope[]>;
}

// models/PermissionModel.ts
interface OPAPermissionModel {
  result: Record<resource, Record<scope, role[]>>;
}

export { OPARoleModel, OPAResourceModel, OPAPermissionModel };
