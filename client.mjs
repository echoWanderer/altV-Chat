import * as alt from 'alt';

let view = new alt.WebView('http://resource/html/index.html');

let chatVisible = true;
let inputVisible = false;

alt.onServer('chat:Broadcast', (senderName, text) => {
	addChatMessage(`${senderName} says: ${text}`);
});

alt.onServer('addChatMessage', addChatMessage);
export function addChatMessage(text) {
	view.emit('addChatMessage', text);
}

alt.onServer('clearChat', clearChat);
export function clearChat() {
	view.emit('clearChatBox');
}

alt.onServer('showChat', showChat);
export function showChat() {
	chatVisible = true;
}

alt.onServer('hideChat', hideChat);
export function hideChat() {
	chatVisible = false;
}

alt.on('keyup', (key) => {
	if (chatVisible === false) return;

    if (inputVisible === true) {
        switch (key) {
            case 0x1B:
				view.emit('hideInput');
                break;
            case 0x26:
                view.emit('shiftHistoryUp');
                break;
            case 0x28:
                view.emit('shiftHistoryDown');
                break;
            case 0x0D:
                view.emit('executeInput');
                break;
		}
		
		view.emit('countInputLength');
    }

    if (inputVisible === false) {
        switch (key) {
            case 0x54:
                view.emit('showInput');
                break;
        }
    }
});

view.on('onChatLoaded', () => {});

view.on('onChatInput', (input) => {
    alt.emitServer('onChatInput', input);
});

view.on('onChatUpdate', (chat, input) => {
	chatVisible = chat;
	inputVisible = input;

	if (inputVisible) {
		alt.showCursor(true);
		alt.toggleGameControls(false);
	} else {
		alt.showCursor(false);
		alt.toggleGameControls(true);
	}
});