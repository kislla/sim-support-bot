const { App } = require('@slack/bolt');

const { registerListeners } = require('./listeners');

require('dotenv').config();

/** APP CONFIG */
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode:true
});

/** Register Listeners */
registerListeners(app);


(async () => {

    await app.start(process.env.PORT || 3000);

    console.log(`⚡️ Bolt app is running! on port ${process.env.PORT || 3000}`);
})();
