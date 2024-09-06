const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger Options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Corrected from 'openai' to 'openapi'
    info: {
      version: '1.0.0',
      title: 'Simple Swagger Setup',
      description: 'Simple Swagger Documentation Setup',
      contact: {
        name: 'Authichef',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/', // Server URL for the API
      },
    ],
  },
  apis: ['Routes/*.js'], // Add paths to your route files for Swagger to read annotations
};

// Initialize Swagger JSDoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs,
};
