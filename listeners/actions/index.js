const { support_fr,support_bug,support_gi } = require('./buttons_clicks');

module.exports.register = (app) => {
    app.action('support_fr', support_fr);
    app.action('support_bug', support_bug);
    app.action('support_gi', support_gi);
};