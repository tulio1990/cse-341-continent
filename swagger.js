const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Contacts API'
  },
  //   host: 'cse-341-ricardo.onrender.com',
  host: 'localhost:3000',
  //   schemes: ['https']
  schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
