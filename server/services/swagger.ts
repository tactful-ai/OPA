import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Your API Documentation",
    version: "1.0.0",
    description: "API to retrieve data from OPA",
  },
  basePath: "/",
  components: {
    schemas: {
      RoleModel: {
        type: "object",
        properties: {
          roles: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
      ResourceModel: {
        type: "object",
        properties: {
          resources: {
            type: "object",
            additionalProperties: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
      },
      PermissionModel: {
        type: "object",
        properties: {
          permissions: {
            type: "object",
            properties: {
              resource: {
                type: "object",
                properties: {
                  scope: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.ts"], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
