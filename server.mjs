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

    if(!commandExists) outputMessage(player, '{FF0000}> Unknown command!');
}

function showCommandInfoMessage(player, command, description, args) {
    outputMessage(player, `{333333}> USAGE: {222222}/${command} ${args}`);
    if (description) outputMessage(player, `{222222}> ${description}`);
}

export function onCommand(command, argumentsCount, callback, description, usage) {
    registeredCommands.push([command, argumentsCount, callback, description, usage]);
    alt.emitClient(null, 'chat:addCommandToChatList', command, description);
}

export function outputMessage(player, text) {
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

function split(s, separator, limit) {
    // split the initial string using limit
    var arr = s.split(separator, limit);
    // get the rest of the string...
    var left = s.substring(arr.join(separator).length + separator.length);
    // and append it to the array
    arr.push(left);
    return arr;
  }