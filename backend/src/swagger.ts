import swaggerJSDoc from "swagger-jsdoc"

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "snap-describe-rest-api",
            version: "1.0.0",
            description: "API Documentation for front-end"
        },
    },
    apis: ["./docs/openapi.yaml"]
}

export const swaggerSpec = swaggerJSDoc(options);