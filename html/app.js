/**
 *  Config
 */

let onLoadMessage = 'Connected to the server.';     // Message which will be displayed after player connects
let maxHistoryInputs = 5;   // How many inputs will be stored to use with arrow keys
let maxInputLength = 100;   // Leave same as in <input> tag

/**
 *  Core
 */

let chatVisible = true;
let inputVisible = false;

let chat = document.getElementById("chat");
let chatBox = document.getElementById("chatBox");
let chatInput = document.getElementById("chatInput");
let chatInfo = document.getElementById("chatInputInfo");
let chatInputLength = document.getElementById("chatInputLength");

let historyList = [];
let historyCurrent;
let historySave;

// Call an event after chat window was loaded
window.onload = (() => {
    alt.emit('onChatLoaded');
    addMessage(onLoadMessage);
});

// Hide chat input if player clicks anywhere but input
chatInput.onblur = (() => {
    if (inputVisible === true) {
        hideInput();
    }
})

/**
 *  User functions
 */

alt.on('addChatMessage', addMessage);
function addMessage(message, convertColors = true) {
    if (convertColors) {
        message = colorify(message);
    }

    chatBox.innerHTML += `<div id="chatMessage" class="chatMessage">${message}</div>`;
    scrollToBottom();
}

alt.on('clearChatBox', clearChat);
function clearChat() {
    chatBox.textContent = '';
}

/**
 *  Chat functionality
 */

function addInputToHistory(input) {
    // If history list have max amount of inputs, start deleting them from the beginning
    if (historyList.length >= maxHistoryInputs) historyList.shift();

    // Add input to history list
    historyList.push(input);
}

alt.on('countInputLength', countInputLength);
function countInputLength() {
    let length = chatInput.value.length;

    if (maxInputLength - length <= 5) {
        chatInputLength.style.color = 'red';
        chatInputLength.className = 'addShadow';
    } else {
        chatInputLength.style.color = 'white';
        chatInputLength.className = '';
    }
    
    chatInputLength.textContent = `${length} / ${maxInputLength}`;
}

alt.on('executeInput', executeInput);
function executeInput() {
    let input = chatInput.value;

    if (input.length > 0) {
        alt.emit('onChatInput', input);
        addInputToHistory(input);
    }
    
    hideInput();
}

alt.on('shiftHistoryUp', shiftHistoryUp);
function shiftHistoryUp() {
    let current = historyCurrent;

    if (historyCurrent == historyList.length) historySave = chatInput.value;

    if (current > 0) {
        historyCurrent--;
        chatInput.value = historyList[historyCurrent];
    }
}

alt.on('shiftHistoryDown', shiftHistoryDown);
function shiftHistoryDown() {
    if (historyCurrent == historyList.length) return;
    if (historyCurrent < historyList.length - 1) {
        historyCurrent++;
        chatInput.value = historyList[historyCurrent];
    } else {
        historyCurrent = historyList.length;
        chatInput.value = historySave;
    }
}

alt.on('showInput', showInput);
function showInput() {
    historySave = '';
    historyCurrent = historyList.length;
    inputVisible = true;

    chatInput.style.opacity = "1";
    chatInfo.style.opacity = "1";
    chatInput.focus();

    chatInput.value = '';
    countInputLength();

    alt.emit('onChatUpdate', chatVisible, inputVisible);
}

alt.on('hideInput', hideInput);
function hideInput() {
    inputVisible = false;
    
    chatInput.style.opacity = "0";
    chatInfo.style.opacity = "0";

    alt.emit('onChatUpdate', chatVisible, inputVisible);
}

alt.on('showChat', showChat);
function showChat() {
    chatVisible = true;
    chat.style.opacity = '1';
}

alt.on('hideChat', hideChat);
function hideChat() {
    hideInput();
    chatVisible = false;
    chat.style.opacity = '0';
}

function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 *  Utilities
 */

function colorify(text) {
    if (!text) return text;
    if (text.length <= 0) return text;

    let matches = [];
    let m = null;
    let curPos = 0;
    do {
        m = /\{[A-Fa-f0-9]{3}\}|\{[A-Fa-f0-9]{6}\}/g.exec(text.substr(curPos));
        if (!m) break;
        matches.push({
            found: m[0],
            index: m['index'] + curPos
        });
        curPos = curPos + m['index'] + m[0].length;
    } while (m != null);
    if (matches.length > 0) {
        text += '</font>';
        for (let i = matches.length - 1; i >= 0; --i) {
            let color = matches[i].found.substring(1, matches[i].found.length - 1);
            let insertHtml =
                (i != 0 ? '</font>' : '') + '<font color="#' + color + '">';
            text =
                text.slice(0, matches[i].index) +
                insertHtml +
                text.slice(matches[i].index + matches[i].found.length, text.length);
        }
    }
    return text;
}