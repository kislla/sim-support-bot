
const thread_reply = () => {
    //console.log(blocks);
    return JSON.stringify([
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Thank you for reaching out!\n\nIn order to better assist you, could you please let us know if your inquiry is related to a feature request, a bug report, or a general question about our product?\n"
            }
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": "Feature Request"
                    },
                    "style": "primary",
                    "value": "support_fr",
                    "action_id": "support_fr"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": "Bug Report"
                    },
                    "style": "danger",
                    "value": "support_bug",
                    "action_id": "support_bug"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": "General Inquiry"
                    },
                    "value": "support_gi",
                    "action_id": "support_gi"
                }
            ]
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "This information will help us understand your needs and provide the most appropriate assistance possible.\n\nThank you again for contacting us, and we look forward to hearing back from you soon."
            }
        }
    ]);
}
//thread_reply();
module.exports = thread_reply;