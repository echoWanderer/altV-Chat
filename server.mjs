import * as alt from 'alt';

let registeredCommands = [];

alt.onClient('onChatInput', (player, input) => {
    let isCommand = (input[0] === '/') ? true : false;
    
    if (isCommand) {
        executeCommand(player, input);
    } else {
        alt.emitClient(null, 'chat:Broadcast', player.name, input);
    }

    console.log(`[CHAT] ${player.name}: ${input}`);
});

function executeCommand(player, input) {
    let commandExists = false;

    registeredCommands.find((cmdArray) => {
        let [ command, callback, requiredArgumentsCount, description, args ] = cmdArray;
        let spaceLocation = input.search(' ');
        let hasArguments = (spaceLocation === -1) ? false : true;
        let userCommand = (hasArguments) ? input.substr(1, spaceLocation - 1) : input.substr(1);

        if (command === userCommand) {
            commandExists = true;
            if (requiredArgumentsCount === 0) return callback(player);

            if (hasArguments) {
                // Take all input and split it into array
                let specifiedArguments = split(input, ' ', requiredArgumentsCount);
                console.log(specifiedArguments);
                // Remove command text from an array
                specifiedArguments.shift();

                console.log(specifiedArguments);
                
                // Check if has all required arguments
                if (specifiedArguments.indexOf('') === -1) {
                    callback(player, ...specifiedArguments);
                } else showCommandInfoMessage(player, command, description, args);
                // Player did specified argument(s)

            } else showCommandInfoMessage(player, command, description, args);
            return;
        }
    });

    if(!commandExists) output(player, '{FF0000}> Unknown command!');
}

function showCommandInfoMessage(player, command, description, args) {
    if (args)
        output(player, `{777777}USAGE: {555555}/${command} ${args}`);
    else
        output(player, `{777777}USAGE: {555555}/${command}`);

    if (description) output(player, `{555555}> ${description}`);
}

export function onCommand(command, argumentsCount, callback, description, usage = undefined) {
    registeredCommands.push([command, argumentsCount, callback, description, usage]);
}

export function output(player, text) {
	alt.emitClient(player, 'addChatMessage', text);
}

export function broadcast(text) {
    alt.emitClient(null, 'addChatMessage', text);
}

export function showChat(player) {
    alt.emitClient(player, 'showChat');
}

export function hideChat(player) {
    alt.emitClient(player, 'hideChat');
}

/**
 *  Utilities
 */

onCommand('help', (player) => {
    output(player, `{0099ff}[ List of commands ]`);
    registeredCommands.forEach((c) => {
        const [ command, _, __, description ] = c;
        output(player, `{80ccff}/${command}{b3e0ff} - ${description}`);
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
 *  Resource Update Control
 * 
 */

// If you don't want to get information about resource updates, change it to 'true' (not recommended)
const disableVersionCheck = false;

// Ignore everything below
import _w_fetch from 'node-fetch';
import _w_meta from './meta.json';
let _w_msgs = 0;
let _w_interval;
_w_fetch('https://raw.githubusercontent.com/echoWanderer/altV-Chat/master/meta.json', { method: "Get" })
    .then((res) => res.json())
    .then((json) => {
        const repoVersion = json.version;
        const curVersion = _w_meta.version;
        
        if(curVersion !== repoVersion) {
            _w_interval = setInterval(() => {
                alt.logWarning(`\nChat resource has been updated!\nNew version: ${repoVersion} | Current version: ${curVersion}\nPlease update it with git or download as a package from https://github.com/echoWanderer/altV-Chat\n`);
                _w_msgs++;
                if(_w_msgs > 5) clearInterval(_w_interval);
            }, 30000);
        }
    }).catch();