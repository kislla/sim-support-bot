# Stigg Support Bot
This is a Slack app is designed to listen to messages in customer channels, gather their input and create a Support ticket in Monday.com.

Each customer message is replied to with a message that asks for more information about the issue. Once the customer replies to the thread, a new comment is added on the ticket.

If the customer clicks on the ticket classification buttons, the ticket is moved to the relevant group in Monday.
![](https://gcdnb.pbrd.co/images/sTNDPFGUHzRE.png?o=1)

Before getting started, make sure you have a development workspace where you have permissions to install apps. If you don’t have one setup, go ahead and [create one](https://slack.com/create).
## Installation

#### Create a Slack App
1. Open [https://api.slack.com/apps/new](https://api.slack.com/apps/new) and choose "From an app manifest"
2. Choose the workspace you want to install the application to
3. Copy the contents of [manifest.json](./manifest.json) into the text box that says `*Paste your manifest code here*` (within the JSON tab) and click *Next*
4. Review the configuration and click *Create*
5. Click *Install to Workspace* and *Allow* on the screen that follows. You'll then be redirected to the App Configuration dashboard.
6. On [Monday.com](https://developer.monday.com/api-reference/docs/authentication), create a new API token and copy it into your `.env` file as `MONDAY_API_TOKEN`
7. Using the [Monday.com API](https://developer.monday.com/api-reference/docs/boards), find your board ID and copy it into your `.env` file as `MONDAY_BOARD_ID`

#### Environment Variables
Before you can run the app, you'll need to store some environment variables.

1. Rename `.env.sample` to `.env`
2. Open your apps configuration page from [this list](https://api.slack.com/apps), click *OAuth & Permissions* in the left hand menu, then copy the *Bot User OAuth Token* into your `.env` file under `SLACK_BOT_TOKEN`
3. Click *Basic Information* from the left hand menu and follow the steps in the *App-Level Tokens* section to create an app-level token with the `connections:write` scope. Copy that token into your `.env` as `SLACK_APP_TOKEN`.
4. On the *Basic Information* page, copy the *Signing Secret* into your `.env` as `SLACK_SIGNING_SECRET`

### Setup Your Local Project
```zsh
# Clone this project onto your machine
git clone https://github.com/kislla/stigg-bot.git

# Change into this project directory
cd stigg-bot

# Install dependencies
npm install

# Run Bolt server
npm start
```

## Project Structure

### `manifest.yaml`

`manifest.yaml` is a configuration for Slack apps. With a manifest, you can create an app with a pre-defined configuration, or adjust the configuration of an existing app.

### `app.js`

`app.js` is the entry point for the application and is the file you'll run to start the server. This project aims to keep this file as thin as possible, primarily using it as a way to route inbound requests.

### `/listeners`

Every incoming request is routed to a "listener". Inside this directory, we group each listener based on the Slack Platform feature used, so `/listeners/actions` incoming action events such as button clicks, `/listeners/messages` handles inbound message events and thread replies.

### `/templates`
A collection of Block Kit templates used by the app. These are used to create views, messages, and modals.

### `/utils`
A collection helper functions used by the app. Calls to the Monday.com API are made here for example.
