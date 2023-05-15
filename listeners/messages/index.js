const { case_handlers } = require('./case_handler');

module.exports.register = (app) => {
    app.message( case_handlers);
};