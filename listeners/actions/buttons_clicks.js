//const {updateCaseType} = require("../../utils/local_storage_handlers");
const {asyncTimeout} = require("../../utils/async_timeout");
const {getItemByColumnValue, moveItemToGroup} = require("../../utils/monday");
const {updateCaseType} = require("../../utils/local_storage_handlers");
const support_fr = async ({ ack,say, client, body }) => {
    await ack();
    const thread_ts = body.message.thread_ts;
    await say({text:'Thank you for your FR feedback! We will get back to you as soon as possible.',thread_ts:thread_ts});

    await asyncTimeout(30000); // wait 30 seconds CUZ MONDAY API IS SLOW
    const item = await getItemByColumnValue('text9',thread_ts); // get item by thread_ts
    const moved_item = await moveItemToGroup('group_title',item.items_by_column_values[0].id); // move item to FR group
}
const support_bug = async ({ ack,say, client, body }) => {
    await ack();
    const thread_ts = body.message.thread_ts;
    await say({text:'Thank you for your BUG feedback! We will get back to you as soon as possible.',thread_ts:thread_ts});

    await asyncTimeout(30000); // wait 30 seconds CUZ MONDAY API IS SLOW
    const item = await getItemByColumnValue('text9',thread_ts); // get item by thread_ts
    const moved_item = await moveItemToGroup('topics',item.items_by_column_values[0].id); // move item to FR group

}
const support_gi = async ({ ack,say, client, body }) => {
    await ack();
    const thread_ts = body.message.thread_ts;
    await say({text:'Thank you for your General Question feedback! We will get back to you as soon as possible.',thread_ts:thread_ts});

    await asyncTimeout(30000); // wait 30 seconds CUZ MONDAY API IS SLOW
    const item = await getItemByColumnValue('text9',thread_ts); // get item by thread_ts
    const moved_item = await moveItemToGroup('new_group24572',item.items_by_column_values[0].id); // move item to FR group

}

module.exports = { support_fr, support_bug, support_gi };