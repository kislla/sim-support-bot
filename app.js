const { App } = require('@slack/bolt');
const {createItemObject,addItemToGroup,getItemByColumnValue, addUpdateToItem, moveItemToGroup} = require("./monday");

const thread_reply = require("./templates/thread_reply");
const {addComment,addCase, updateCaseType} = require("./events/msg_handlers")

let caseStore = new Map();
require('dotenv').config();



const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    //processBeforeResponse: true
});


app.action("support_fr",async ({ ack, body, context,say }) => {
    await ack();

    const thread_ts = body.message.thread_ts;
    updateCaseType(caseStore,body,"support_fr");

    const item = await getItemByColumnValue('text9',thread_ts); // get item by thread_ts
    const moved_item = await moveItemToGroup('group_title',item.items_by_column_values[0].id); // move item to FR group
    console.log(caseStore);
    await say({text:'Thank you for your FR feedback! We will get back to you as soon as possible.',thread_ts:thread_ts});

});

app.action('support_bug', async ({ body, ack, say }) => {
    // Acknowledge the action
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
});

app.action('support_gi', async ({ body, ack, say }) => {
    // Acknowledge the action
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
});



app.message( async ({ message, say }) => {
    console.log(message);

    if(message.thread_ts){

        console.log("stigg thread message action!");
        // let support_case = caseStore.get(message.thread_ts);
        // if (!support_case) { // if no case exists, create one
        //     caseStore.set(message.thread_ts, {
        //         user: message.parent_user_id,
        //         channel: message.channel,
        //         ts: message.thread_ts,
        //         text: message.text,
        //         support_case_type: undefined,
        //         thread_msgs: []
        //     })
        // }
        // support_case = caseStore.get(message.thread_ts);
        // support_case.thread_msgs.push({user: message.user, channel: message.channel, ts: message.ts, text: message.text});
        // caseStore.set(message.thread_ts, support_case);
        // console.log(`added thread message to ${message.thread_ts} in case store`);
        addComment(caseStore,message.thread_ts,message);
        console.log(caseStore);

        // add update to monday.com item by message.ts
        const item = await getItemByColumnValue('text9',message.thread_ts); // get item by parent message ts
        const addUpdate = await addUpdateToItem(item.items_by_column_values[0].id, message.text); // add update to item
        console.log(addUpdate);

    } else {
        console.log('New message in channel');

        await say({text: `Thanks for reaching out!`, blocks: JSON.parse(thread_reply()), thread_ts: message.ts});

        addCase(caseStore,message.ts,message);
        console.log(caseStore)
        // create a new item on monday.com in unassigned queue
        let mndy_item = await createItemObject(message.text, message.user, message.channel, message.ts);
        let res = await addItemToGroup('new_group13472', mndy_item);
        console.log(`added new item to monday.com group: ${res}`);

    }

});

(async () => {
    // Start your app

    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();


//
//
// const { App } = require('@slack/bolt');
//
// /*
// This sample slack application uses SocketMode
// For the companion getting started setup guide,
// see: https://slack.dev/bolt-js/tutorial/getting-started
// */
//
// // Initializes your app with your bot token and app token
// const app = new App({
//     token: "xoxb-5251212000882-5266944986852-VxfVngGaWzbkERa1BYP8dfZc",
//    // socketMode: true,
//     appToken: "xapp-1-A057FLZDLEQ-5262212185028-be9e258328f09f4c7bd9c7ddd6f69d13b769b26c9aa0ab4e8ad6d320656c6b1e",
//     signingSecret: "f17b0609c8e406793f9ba463573d3c32",
// });
//
// // Listens to incoming messages that contain "hello"
//
// app.action('support_gi', async ({ body, ack, say }) => {
//     // Acknowledge the action
//     await ack();
//     await say(`<@${body.user.id}> clicked the button`);
// });
//
// (async () => {
//     app.message('hello', async ({ message, say }) => {
//         // say() sends a message to the channel where the event was triggered
//         await say({text: `Thanks for reaching out!`, blocks:[
//                 {
//                     "type": "section",
//                     "text": {
//                         "type": "mrkdwn",
//                         "text": "Thank you for reaching out!\n\nIn order to better assist you, could you please let us know if your inquiry is related to a feature request, a bug report, or a general question about our product?\n"
//                     }
//                 },
//                 {
//                     "type": "actions",
//                     "elements": [
//                         {
//                             "type": "button",
//                             "text": {
//                                 "type": "plain_text",
//                                 "emoji": true,
//                                 "text": "Feature Request"
//                             },
//                             "style": "primary",
//                             "value": "support_fr",
//                             "action_id": "support_fr"
//                         },
//                         {
//                             "type": "button",
//                             "text": {
//                                 "type": "plain_text",
//                                 "emoji": true,
//                                 "text": "Bug Report"
//                             },
//                             "style": "danger",
//                             "value": "support_bug",
//                             "action_id": "support_bug"
//                         },
//                         {
//                             "type": "button",
//                             "text": {
//                                 "type": "plain_text",
//                                 "emoji": true,
//                                 "text": "General Inquiry"
//                             },
//                             "value": "support_gi",
//                             "action_id": "support_gi"
//                         }
//                     ]
//                 },
//                 {
//                     "type": "section",
//                     "text": {
//                         "type": "mrkdwn",
//                         "text": "This information will help us understand your needs and provide the most appropriate assistance possible.\n\nThank you again for contacting us, and we look forward to hearing back from you soon."
//                     }
//                 }
//             ]});
//     });
//
//     // Start your app
//     await app.start(process.env.PORT || 3000);
//
//     console.log('⚡️ Bolt app is running!');
// })();