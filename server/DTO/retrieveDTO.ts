// models/RoleModel.ts
interface RoleModel {
  roles: string[];
}

// models/ResourceModel.ts
interface ResourceModel {
  resources: Record<string, string[]>;
}

// models/PermissionModel.ts
interface PermissionModel {
  permissions: Record<string, Record<string, string[]>>;
}

export { RoleModel, ResourceModel, PermissionModel };
