import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Sistema GOS",
      version: "1.0.0",
      description: "Documentação da API para o Sistema GOS",
    },
  },
  apis: [
    "./src/modules/company/routers/*.ts",
    "./src/modules/auth/routers/*.ts",
    "./src/modules/home/routers/*.ts",
    "./src/modules/user/routers/*.ts",
    "./src/modules/technician/routers/*.ts",
    "./src/modules/customer/routers/*.ts",
    "./src/modules/equipment/routers/*.ts",
    "./src/modules/serviceOrder/routers/*.ts",
  ],
};
