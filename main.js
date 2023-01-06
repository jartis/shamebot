import * as dotenv from 'dotenv';
dotenv.config();
console.log(process.env);
import {
    Client,
    GatewayIntentBits
} from 'discord.js';
import fs from 'fs';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const resMessagesFile = fs.readFileSync('./messages.json', 'utf-8');
const resMessagesObj = JSON.parse(resMessagesFile);
const resHeader = (resMessagesObj.header).join(' ');
const resMessages = resMessagesObj.content;

let lastMessage = null;
let countChan = null;
let countDisc = null;

client.once('ready', async () => {
    console.log('Ready!');

    // remove and switch to database
    // hyland server channels
    countChan = await client.channels.fetch(process.env.ENV_COUNTING_CHANNEL);
    countDisc = await client.channels.fetch(process.env.ENV_MESSAGE_CHANNEL);

    const lastMessageCollection = await countChan.messages.fetch({
        limit: 1
    });
    // Hacky way to enforce starting from a blank channel:
    // If there's no messages, make a fake message with a 0 value
    lastMessage = lastMessageCollection.first() || { 
        content: '0',
        author: {
            username: 'Nobody',
        },
    };
});

client.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    if (msg.channelId == countChan.id) {
        if (!Number.isInteger(parseInt(msg.content))) { // Doesn't parse to integer
            msg.delete().then(() => {
                let rand = Math.floor(Math.random() * (resMessages.notNum.length - 1));
                countDisc.send(`${transformHeader(msg)}
                ${resMessages.notNum[rand]}`);
            });
            return;
        } else {
            if (lastMessage.author.username == msg.author.username) { // Same user
                msg.delete().then(() => {
                    let rand = Math.floor(Math.random() * (resMessages.sameAuthor.length - 1));
                    countDisc.send(`${transformHeader(msg)}
                    ${resMessages.sameAuthor[rand]}`);
                });
                return;
            }
            if (msg.content == parseInt(lastMessage.content)) { // Number already taken
                msg.delete().then(() => {
                    let rand = Math.floor(Math.random() * (resMessages.takenNum.length - 1));
                    countDisc.send(`${transformHeader(msg)}
                    ${resMessages.takenNum[rand]}`);
                });
                return;
            }
            if (msg.content[0] == "0") { // Leading zero / hex attempt
                msg.delete().then(() => {
                    let rand = Math.floor(Math.random() * (resMessages.leadingZero.length - 1));
                    countDisc.send(`${transformHeader(msg)} ${resMessages.leadingZero[rand]}`);
                });
                return;
            }
            if (parseInt(msg.content) != (parseInt(lastMessage.content) + 1)) { // Wrong number
                msg.delete().then(() => {
                    let rand = Math.floor(Math.random() * (resMessages.wrongNum.length - 1));
                    countDisc.send(`${transformHeader(msg)}
                    ${resMessages.wrongNum[rand]}`);
                });
                return;
            }

            lastMessage = msg;
            // msg.react('👍');
        }
    }
});

function transformHeader(msg) {
    let newString = resHeader.replace('{AUTHOR}', msg.author);
    newString = newString.replace('{MSG}', msg.content);
    return newString;
}

// eslint-disable-next-line no-undef
client.login(process.env.ENV_BOT_TOKEN);