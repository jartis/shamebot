# Hacky Hyland, Jr.

## What is this?
This is a Discord bot designed for the Hyland Hackathon Discord server. Made purposefully to regulate counting originally, utilizes GitHub Actions, Docker, and Fly.io for continuous deployment. 😊

Features:
* Extremely customizable dynamic message system
* Tracks all messages in a specific channel
* Provides personality to your server
* Moderates unwanted messages and responds dynamically

**Super easy to add your own messages, follow the format in `messages.json`!**


## Setup:

1. If you plan to use `fly.io` for running your bot, create an account at fly.io, and under `Account`, generate a new token. Create a GitHub Secret called `FLY_API_TOKEN` with this value.
1. Through the tutorial, use `flyctl launch` to create a new app named `shamebot`. If you do not create the account first, the build action will be unable to deploy when updates are made.
1. Create a GitHub Secret called `COUNTING_CHANNEL` with the Numeric ID of your dedicated counting channel.
1. Create a GitHub Secret called `MESSAGE_CHANNEL` with the Numeric ID of the channel you wish to send moderation messages (shame) to. Make sure this is a different channel than the `COUNTING_CHANNEL`!
1. Create a Discord app in your developer portal, and create an associated bot account. Make sure you hang on to the tokens. Your bot will require the `Message Content Intent` permission. Use the OAuth panel to add the bot to your server.
1. Create a GitHub Secret calls `BOT_TOKEN` with the API token from the Discord dev portal.
1. Run the action in this repo to deploy to `fly.io`

#### Uses:
> **Fly.io, NodeJS, Discord's API, JavaScript**

## Why?
This originated as a way to regulate counting messages in the Hy-Tech Club Discord server.
