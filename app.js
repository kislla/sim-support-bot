const { App } = require('@slack/bolt');
const {createItemObject,addItemToGroup,getItemByColumnValue, addUpdateToItem, moveItemToGroup} = require("./monday");

const thread_reply = require("./templates/thread_reply");
const {addComment,addCase, updateCaseType} = require("./utils/local_storage_handlers")
const {asyncTimeout} = require("./utils/async_timeout");
let caseStore = new Map();
require('dotenv').config();



const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode:true,
    //processBeforeResponse: true
});


app.action("support_fr",async ({ ack, body, context,say }) => {
    await ack();

    const thread_ts = body.message.thread_ts;

    updateCaseType(caseStore,body,"support_fr"); // local storage update

    await say({text:'Thank you for your FR feedback! We will get back to you as soon as possible.',thread_ts:thread_ts});

    await asyncTimeout(30000); // wait 30 seconds CUZ MONDAY API IS SLOW
    const item = await getItemByColumnValue('text9',thread_ts); // get item by thread_ts
    const moved_item = await moveItemToGroup('group_title',item.items_by_column_values[0].id); // move item to FR group

});

app.action('support_bug', async ({ body, ack, say }) => {
    await ack();

    const thread_ts = body.message.thread_ts;

    updateCaseType(caseStore,body,"support_bug"); // local storage update
    await say({text:'Thank you for your BUG feedback! We will get back to you as soon as possible.',thread_ts:thread_ts});

    await asyncTimeout(30000); // wait 30 seconds CUZ MONDAY API IS SLOW
    const item = await getItemByColumnValue('text9',thread_ts); // get item by thread_ts
    const moved_item = await moveItemToGroup('topics',item.items_by_column_values[0].id); // move item to FR group
});

app.action('support_gi', async ({ body, ack, say }) => {
    await ack();

    const thread_ts = body.message.thread_ts;

    updateCaseType(caseStore,body,"support_gi"); // local storage update
    await say({text:'Thank you for your General Question feedback! We will get back to you as soon as possible.',thread_ts:thread_ts});

    await asyncTimeout(30000); // wait 30 seconds CUZ MONDAY API IS SLOW
    const item = await getItemByColumnValue('text9',thread_ts); // get item by thread_ts
    const moved_item = await moveItemToGroup('new_group24572',item.items_by_column_values[0].id); // move item to FR group
});



app.message( async ({ message, say }) => {
    console.log(message);

    if(message.thread_ts){

        console.log("stigg thread message action!");
        addComment(caseStore,message.thread_ts,message);
        console.log(caseStore);

        // add update to monday.com item by message.ts
        await asyncTimeout(30000); // wait 30 seconds CUZ MONDAY API IS SLOW
        const item = await getItemByColumnValue('text9',message.thread_ts); // get item by parent message ts
        const addUpdate = await addUpdateToItem(item.items_by_column_values[0].id, message.text); // add update to item
        console.log(addUpdate);

    } else {
        console.log('New message in channel');

        await say({text: `Thanks for reaching out!`, blocks: JSON.parse(thread_reply()), thread_ts: message.ts});

        addCase(caseStore,message.ts,message);
        console.log(caseStore)
        // create a new item on monday.com in unassigned queue
        let item = await createItemObject(message.text, message.user, message.channel, message.ts);
        let res = await addItemToGroup('new_group13472', item);
        console.log(`added new item to monday.com group: ${res}`);

    }

});

(async () => {
    // Start your app

    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();
