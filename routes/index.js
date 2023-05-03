const routes = require('express').Router();

routes.use('/', require('./swagger'));
routes.use('/countries', require('./countries'));
routes.use('/people', require('./people'));

module.exports = routes;
