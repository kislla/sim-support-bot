const {asyncTimeout} = require("../../utils/async_timeout");
const {getItemByColumnValue, addUpdateToItem, createItemObject, addItemToGroup} = require("../../utils/monday");
const thread_reply = require("../../templates/thread_reply");
const case_handlers = async ({ message, say, context }) => {
    console.log(message);

    if(message.thread_ts){
        console.log("New message in thread");

        await asyncTimeout(30000); // wait 30 seconds CUZ MONDAY API IS SLOW
        const item = await getItemByColumnValue('text9',message.thread_ts); // get item by parent message ts
        const addUpdate = await addUpdateToItem(item.items_by_column_values[0].id, message.text); // add comment to item
        console.log(`added new UPDATE to monday.com item: ${message.thread_ts}`);

    } else {
        console.log('New message in channel');
        await say({text: `Thanks for reaching out!`, blocks: JSON.parse(thread_reply()), thread_ts: message.ts});

        let item = await createItemObject(message.text, message.user, message.channel, message.ts); // create a new item on monday.com in unassigned queue
        let res = await addItemToGroup('new_group13472', item);
        console.log(`added new ITEM to monday.com group: ${res}`);
    }
}
module.exports = { case_handlers };