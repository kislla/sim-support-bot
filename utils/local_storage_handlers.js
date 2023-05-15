const addCase = (caseStorage, key, message) => {
    console.log(message)
    caseStorage.set(key, {
        user: message.user || message.user.id,
        channel: message.channel || message.channel.id,
        ts: message.ts,
        text: message.text ||message.message.text,
        support_case_type: undefined,
        thread_msgs: []
    });
}
const getCase = (caseStorage, key) => {
    return caseStorage.get(key);

}

const addComment = (caseStore, key, message) => {
    let support_case = getCase(caseStore, key);

    if (!support_case) { // if no case exists, create one
        addCase(caseStore, message.thread_ts, message);
    }
    support_case = getCase(caseStore,message.thread_ts);
    support_case.thread_msgs.push({user: message.user, channel: message.channel, ts: message.ts, text: message.text});
    caseStore.set(message.thread_ts, support_case);
    console.log(`added thread message to ${message.thread_ts} in case store`);
}
const updateCaseType = (caseStore, message, type) => {
    let support_case = caseStore.get(message.thread_ts);
    if (!support_case) { // if no case exists, create one
        const thread_ts = message.message.thread_ts || message.message.ts;
        addCase(caseStore, thread_ts, message);
    }
    const thread_ts = message.message.thread_ts || message.message.ts;
    support_case = caseStore.get(thread_ts);
    support_case.support_case_type = type;
    caseStore.set(thread_ts, support_case);
    console.log(`updated ${thread_ts} case type to ${type} in case store`);
}

module.exports = {addComment, addCase, updateCaseType};