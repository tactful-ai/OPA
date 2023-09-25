type role = string;
type resource = string;
type scope = string;
type description = string;
type roleWithDescription = { role: role; description: description };

type IDEFile = {
  file: boolean;
  path: string;
  text: string;
  ID: string;
  code: string | null;
  children: string[];
  root: Boolean;
};

export { role, resource, scope, description, roleWithDescription, IDEFile };
