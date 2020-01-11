/// <reference types="@altv/types" />
/// <reference types="@altv/native-types" />
import * as alt from 'alt-client'
import * as game from 'natives';

let chatActive = false;
let inputActive = false;
let scrollActive = false;

const webview = new alt.WebView('http://resource/client/html/index.html');
webview.focus();

webview.on('chat:onLoaded', () => {
    activateChat(true);
    push('Connected to the server', 'limegreen', [0, 190, 0], 'check')

    for(let i = 0; i < 12; i++)
        push(`i: ${i}`);
});

webview.on('chat:onInputStateChange', state => {
    inputActive = state;

    alt.showCursor(state);
    alt.toggleGameControls(!state);
});

webview.on('chat:onChatStateChange', state => {
    chatActive = state;
});

webview.on('chat:onInput', message => {
    alt.emitServer('chat:onInput', message);
});

alt.onServer('chat:sendMessage', (sender, message) => {
    push(`${sender} says: ${message}`);
});

export function push(text, color = 'white', gradient = false, icon = false) {
    webview.emit('chat:pushMessage', text, color, gradient, icon);
}

export function icon(name, paddingLeft = 0, paddingRight = 0) {
    webview.emit('chat:insertIcon', name, paddingLeft, paddingRight);
}

export function activateChat(state) {
    webview.emit('chat:activateChat', state);
}

export function activateInput(state) {
    webview.emit('chat:activateInput', state);
}


alt.on('keyup', key => {
    alt.log(key);
    
    // Keys working only when chat is not active
    if (!chatActive) {
        switch (key) {
        }
    }

    // Keys working only when chat is active
    if (chatActive) {
        switch (key) {
            // PageUp
            case 33: return scrollMessagesList('up');
            // PageDown
            case 34: return scrollMessagesList('down');
        }
    }

    // Keys working only when chat is active and input is not active
    if (chatActive && !inputActive) {
        switch (key) {
            // KeyT
            case 84: return activateInput(true);
        }
    }

    // Keys working only when chat is active and input is active
    if (chatActive && inputActive) {
        switch (key) {
            // Enter
            case 13: return sendInput();
            // ArrowUp
            case 38: return shiftHistoryUp();
            // ArrowDown
            case 40: return shiftHistoryDown();
        }
    }
});

function scrollMessagesList(direction) {
    if (scrollActive) return;
    scrollActive = true;
    alt.setTimeout(() => scrollActive = false, 250 + 5);
    webview.emit('chat:scrollMessagesList', direction);
}

function sendInput() {
    webview.emit('chat:sendInput');
}

function shiftHistoryUp() {
    webview.emit('chat:shiftHistoryUp');
}

function shiftHistoryDown() {
    webview.emit('chat:shiftHistoryDown');
}