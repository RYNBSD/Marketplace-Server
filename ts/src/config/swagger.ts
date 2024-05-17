import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { VALUES } from "../constant/index.js";
import path from "node:path";

const { PACKAGE } = VALUES;
const APIs_PATH = path.join(__root, "ts/**/*.ts");

const options: swaggerJsdoc.Options = {
  failOnErrors: true,
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Marketplace API",
      version: PACKAGE.VERSION,
      description:
        "This is a swagger documentation for marketplace, this is not for testing api, if you want to test it use for eg: postman",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "",
        url: "",
        email: "",
      },
    },
    servers: [
      {
        url: `http://localhost:3000/v${PACKAGE.VERSION}`,
      },
    ],
  },
  apis: [APIs_PATH],
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
