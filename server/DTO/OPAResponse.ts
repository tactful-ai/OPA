// models/RoleModel.ts
interface OPARoleModel {
  result: string[];
}

// models/ResourceModel.ts
interface OPAResourceModel {
  result: Record<string, string[]>;
}

// models/PermissionModel.ts
interface OPAPermissionModel {
  result: Record<string, Record<string, string[]>>;
}

export { OPARoleModel, OPAResourceModel, OPAPermissionModel };
