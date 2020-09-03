'use strict';
require('dotenv').config();
var builder = require('botbuilder');
var botbuilder_azure = require('botbuilder-azure');

// console.log('builder', builder);

var useEmulator = true;
var userName = '';
var yearsCoding = '';
var selectedLanguage = '';

// console.log(process.env.MicrosoftAppId);
var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// console.log('connector', connector);

var bot = new builder.UniversalBot(connector);
// console.log('bot', bot);

bot.dialog('/', [

    function(session) {
        builder.Prompts.text(session, "Hello, and welcome to QnA Factbot! What's your name?");
    },

    function(session, results) {
        userName = results.response;
        builder.Prompts.number(session, 'Hi ' + userName + ', how many years have you been writing code?');
    },

    function(session, results) {
        yearsCoding = results.response;
        builder.Prompts.choice(session, 'What language do you love the most?', ['C#', 'Python', 'Node.js', 'Visual FoxPro']);
    },

    function(session, results) {
        selectedLanguage = results.response.entity;

        session.send('Okay, ' + userName + ", I think I've got it:" +
        " You've been writing code for " + yearsCoding + ' years,' +
        ' and prefer to use ' + selectedLanguage + '.');
    }]);

var restify = require('restify');
var server = restify.createServer();

server.listen(3978, function() {
    console.log('test bot endpoint at http://localhost:3978/api/messages');
});

server.post('/api/messages', connector.listen());
