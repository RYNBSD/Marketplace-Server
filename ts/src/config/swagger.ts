import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { VALUES } from "../constant/index.js";

const { PACKAGE } = VALUES;

const options: swaggerJsdoc.Options = {
  failOnErrors: true,
  definition: {
    openapi: "3.1.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: PACKAGE.VERSION,
      description: "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: `http://localhost:3000/v${PACKAGE.VERSION}`,
      },
    ],
  },
  apis: ["**/*.ts"],
};

export default {
  init() {
    const json = swaggerJsdoc(options);
    const ui = swaggerUi.setup(json, { explorer: true });
    return {
      json,
      serve: swaggerUi.serve,
      ui,
    };
  },
} as const;
