/// <reference types="@altv/types" />
/// <reference types="@altv/native-types" />
import * as alt from 'alt-server'

let commands = [];

alt.onClient('chat:onInput', (player, isCommand, message) => {
    (!isCommand) ? alt.emitClient(null, 'chat:sendMessage', player.name, message) : executeCommand(player, message);
});

export function registerCommand(command, argumentsCount, callback, description, usage = undefined) {
    commands.push([command, argumentsCount, callback, description, usage]);
}

// Backwards compatibility until next update
export function onCommand(...args) {
    alt.logWarning('Chat function "onCommand" is deprecated. Consider using "registerCommand" as old one will be removed after next update.');
    registerCommand(...args);
}

export function sendClient(player, text, color = 'white', gradient = false, icon = false) {
    alt.emitClient(player, 'chat:showMessage', text, color, gradient, icon);
}

// Backwards compatibility until next update
export function output(...args) {
    alt.logWarning('Chat function "output" is deprecated. Consider using "sendClient" as old one will be removed after next update.');
    sendClient(...args);
}

export function sendAll(text, color = 'white', gradient = false, icon = false) {
    alt.emitClient(null, 'chat:showMessage', text, color, gradient, icon);
}

// Backwards compatibility until next update
export function broadcast(...args) {
    alt.logWarning('Chat function "broadcast" is deprecated. Consider using "sendAll" as old one will be removed after next update.');
    sendAll(...args);
}

export function activateChat(player, state) {
    alt.emitClient(player, 'chat:activateChat', state);
}

// Backwards compatibility until next update
export function showChat(...args) {
    alt.logError('Chat function "showChat" is deprecated. Consider using "activateChat" as old one will be removed after next update. Function was not called!');
}

// Backwards compatibility until next update
export function hideChat(...args) {
    alt.logError('Chat function "hideChat" is deprecated. Consider using "activateChat" as old one will be removed after next update. Function was not called!');
}

function executeCommand(player, input) {
    let commandExists = false;

    commands.find((cmdArray) => {
        let [ command, callback, requiredArgumentsCount, description, args ] = cmdArray;
        let spaceLocation = input.search(' ');
        let hasArguments = (spaceLocation === -1) ? false : true;
        let userCommand = (hasArguments) ? input.substr(1, spaceLocation - 1) : input.substr(1);

        if (command.toLowerCase() === userCommand.toLowerCase()) {
            commandExists = true;
            if (requiredArgumentsCount === 0) return callback(player);

            if (hasArguments) {
                // Take all input and split it into array
                let specifiedArguments = split(input, ' ', requiredArgumentsCount);

                // Remove command text from an array
                specifiedArguments.shift();
                
                // Check if has all required arguments
                if (specifiedArguments.indexOf('') === -1) {
                    callback(player, ...specifiedArguments);
                } else showCommandInfoMessage(player, command, description, args);
                // Player did specified argument(s)

            } else showCommandInfoMessage(player, command, description, args);
            return;
        }
    });

    if(!commandExists) sendClient(player, 'There is no such a command. You can find all of them by typing /help.', 'tomato', [140, 0, 0], 'x');
}

function showCommandInfoMessage(player, command, description, args) {
    if (args) sendClient(player, `/${command} ${args}`, 'lightgrey', [120, 120, 120], 'magnifying-glass');
    if (description) sendClient(player, `${description}`, 'lightgrey', [120, 120, 120], 'minus');
}

// Example Commands
const _LOAD_EXAMPLE_COMMANDS = true;

if (_LOAD_EXAMPLE_COMMANDS) {
    alt.logWarning('Chat automatically included example commands.');
    alt.logWarning('If you want to disable them, just change a setting in /chat/server/index.mjs.');

    registerCommand('ooc', (player, text) => {
        sendAll(`[OOC] ${player.name}: ${text}`, 'lightsteelblue', false, 'comments');
    }, 1, 'Send a message to global OOC chat.', '[message]');

    registerCommand('me', (player, text) => {
        sendAll(`${player.name} ${text}`, 'orchid', false, 'sound');
    }, 1, 'Describes your chracter\'s action.', '[message]');

    registerCommand('do', (player, text) => {
        sendAll(`${text} (( ${player.name} ))`, 'orchid', false, 'sound');
    }, 1, 'Describes your chracter\'s or object\'s state.', '[message]');

    registerCommand('ad', (_, text) => {
        sendAll(`[AD] ${text} (Ph. #000000)`, 'limegreen', [0, 140, 0], 'telephone');
    }, 1, 'Broadcasts an advertisement to all citizens.', '[message]');

    registerCommand('showError', (player) => {
        sendClient(player, 'This is an example of error message!', 'tomato', [140, 0, 0], 'x');
    }, 0, 'Shows an example of error message.');

    registerCommand('showWarning', (player) => {
        sendClient(player, 'This is an example of warning message!', 'gold', [225, 215, 0], 'alert');
    }, 0, 'Shows an example of warning message.');

    registerCommand('showInfo', (player) => {
        sendClient(player, 'This is an example of informative message!', 'darkgrey', [140, 140, 140], 'rss');
    }, 0, 'Shows an example of informative message.');
}

// Utility
registerCommand('help', (player) => {
    sendClient(player, 'List of commands:', 'lightblue', [90, 90, 160], 'list-thumbnails');
    commands.forEach((c) => {
        const [ command, _, __, description ] = c;
        sendClient(player, `/${command} - ${description}`, 'lightblue', [90, 90, 160]);
    });
}, 0, 'List of commands');

function split(s, separator, limit) {
    // split the initial string using limit
    var arr = s.split(separator, limit);
    // get the rest of the string...
    var left = s.substring(arr.join(separator).length + separator.length);
    // and append it to the array
    arr.push(left);
    return arr;
}

/**
 * 
 *  Resource Version Control
 *  Please do not co-... meh, you won't listen anyway.
 * 
 */

// If you don't want to get information about resource updates, change it to 'true' (not recommended)
const enableVersionCheck = false;

// Ignore everything below
import _w_fetch from"node-fetch";import _w_meta from"../meta.json";if(enableVersionCheck){let _w_interval,_w_msgs=1;_w_fetch("https://raw.githubusercontent.com/echoWanderer/altV-Chat/master/meta.json",{method:"Get"}).then(a=>a.json()).then(a=>{const b=a.version,c=_w_meta.version;b!==c&&(_w_sendrvcmsg(b,c),_w_interval=setInterval(()=>{_w_sendrvcmsg(b,c),_w_msgs++,5<_w_msgs&&clearInterval(_w_interval)},3e4))}).catch();function _w_sendrvcmsg(a,b){alt.logWarning(`Chat resource has been updated!\nCurrent version: ${b} => New version: ${a}\nPlease update it with git or download ZIP from https://github.com/echoWanderer/altV-Chat`)}}