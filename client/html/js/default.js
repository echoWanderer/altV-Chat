// Settings
var _MAX_MESSAGES_ON_CHAT = 10;
var _HIDE_INPUT_BAR_ON_BLUR = true;

// Data
var chatActive = false;
var inputActive = false;

// Elements
var chatBox = $('.chat-box');
var chatMessagesList = $('.chat-box .chat-messages-list');
var chatInputBar = $('.chat-box .chat-input-bar');
var chatInputBarLength = $('.chat-box .chat-input-bar-length');
var chatNewMessagesWarning = $('.chat-box .chat-new-messages-warning');

// Initiation
$(document).ready(() => {
    const messagesListHeight = _MAX_MESSAGES_ON_CHAT * 22.5 - 2;
    const chatBoxHeight = messagesListHeight + 50;

    chatBox.css('height', chatBoxHeight + 'px');
    chatMessagesList.css('height', messagesListHeight + 'px');

    alt.emit('chat:onLoaded');
});
if (_HIDE_INPUT_BAR_ON_BLUR) $(chatInputBar).focusout(() => inputActive && activateInput(false));
chatMessagesList.bind('mousewheel DOMMouseScroll', (e) => e.preventDefault());
chatInputBar.bind('propertychange change click keyup input paste', () => inputActive && setInputBarLengthCounterCurrent(chatInputBar.val().length));

// Functions - Actions
async function pushMessage(text) {
    let message = await formatMessage(text);
    chatMessagesList.append(message);

    // Check if player's chat is scrolled all the way to the bottom. If true, then scroll down for new message to appear,
    // if false, inform player about new message(s).
    (getScrolledUpMessagesAmount() >= 4) ? toggleWarningText(true) : scrollMessagesList('bottom');
}

function formatMessage(text) {
    return new Promise((resolve, reject) => {
        resolve(`<div class="chat-message stroke">${text}</div>`);
    })
}

function scrollMessagesList(direction) {
    const pixels = 22.5 * 5;

    switch (direction) {
        case 'up':
            chatMessagesList.stop().animate({ scrollTop: `-=${pixels}px` }, 250);
            break;
        case 'down':
            chatMessagesList.stop().animate({ scrollTop: `+=${pixels}px` }, 250);
            break;
        case 'bottom':
            chatMessagesList.stop().animate({ scrollTop: chatMessagesList.prop('scrollHeight') }, 250);
            break;
    }

    setTimeout(() => {
        if (getScrolledUpMessagesAmount() == 0) toggleWarningText(false);
    }, 250);
}

function activateChat(state) {
    chatActive = state;
    (state) ? chatBox.removeClass('hide') : chatBox.addClass('hide');

    alt.emit('chat:onChatStateChange', state);
}

function activateInput(state) {
    inputActive = state;
    setInputBarLengthCounterCurrent(0);

    switch (state) {
        case true:
            chatInputBarLength.removeClass('hide');
            chatInputBar.removeClass('hide');
            chatInputBar.focus();
            break;
        case false:
            chatInputBarLength.addClass('hide');
            chatInputBar.addClass('hide');
            chatInputBar.blur();
            break;
    }

    alt.emit('chat:onInputStateChange', state);
}

function sendInput() {
    const message = chatInputBar.val();
    chatInputBar.val('');
    activateInput(false);
    alt.emit('chat:onInput', message);
}

function toggleWarningText(state) {
    switch (state) {
        case true:
            chatNewMessagesWarning.removeClass('hide');
            break;
        case false:
            chatNewMessagesWarning.addClass('hide');
            break;
    }
}

function setInputBarLengthCounterCurrent(amount) {
    chatInputBarLength.html(`<i class="fi-pencil" style="padding-right:2px"></i> ${amount}/100`);
}

// Functions - Checks

function getScrolledUpMessagesAmount() {
    const amount = Math.round((chatMessagesList.prop('scrollHeight') - chatMessagesList.scrollTop() - _MAX_MESSAGES_ON_CHAT * 22.5) / 22.5);
    return (amount > 0) ? amount : 0;
}

// alt:V - Callbacks
alt.on('chat:pushMessage', pushMessage);
alt.on('chat:activateChat', activateChat);
alt.on('chat:activateInput', activateInput);
alt.on('chat:sendInput', sendInput);
alt.on('chat:scrollMessagesList', scrollMessagesList);

/**
 *  ONLY FOR TESTING IN BROWSER
 */

// $(document).ready(() => {
//     // pushMessage('Todd Chapman says: Did you know that, along with gorgeous architecture, it’s home to the largest tamale?');
//     // pushMessage('Norman Butler says: A song can make or ruin a person’s day if they let it get to them.');
//     // pushMessage('Elizabeth Flowers says: I will never be this young again. Ever. Oh damn… I just got older.');

//     // pushMessage('You entered wrong password!', 'tomato', [140, 0, 0], 'x');

//     // pushMessage('Roy Powell says: I love eating toasted cheese and tuna sandwiches.');
//     // pushMessage('Jane Patterson looks to the man and chuckles.', 'orchid', false, 'sound');

//     // pushMessage('[AD] Young male (24) is looking for a well-paid job. Has experience in accounting, managing and doing nothing. Would start right away! [Ph. #486347]', 'limegreen', [0, 140, 0], 'telephone');

//     // pushMessage('Deanna Harmon says: He had reached the point where he was paranoid about being paranoid.');

//     // pushMessage('You report [#405] was submited successfully. Please wait for a staff member to accept it.', 'lawngreen', [0, 200, 0], 'check');

//     // pushMessage('Billy Holmes says: I will never be this young again. Ever. Oh damn… I just got older.');
//     // pushMessage('Marcos Murray says: He said he was not there yesterday; however, many people saw him there. I really want to go to work, but I am too sick to drive.');
//     // pushMessage('Matthew Garrett says: My Mum tries to be cool by saying that she likes all the same things that I do.');

//     // pushMessage('PM to Billy Holmes [32]: Wow, does that work? ))', 'goldenrod', false, 'mail');

//     // pushMessage('Todd Chapman says: Did you know that, along with gorgeous architecture, it’s home to the largest tamale?');
//     // pushMessage('Norman Butler says: A song can make or ruin a person’s day if they let it get to them.');

//     // pushMessage('PM from Billy Holmes [32]: Yup, it sure does, kiddo! ))', 'gold', [225, 215, 0], 'page');

//     // pushMessage('Elizabeth Flowers says: I will never be this young again. Ever. Oh damn… I just got older.');
//     // pushMessage('Deanna Harmon says: He had reached the point where he was paranoid about being paranoid.');
//     // pushMessage('Roy Powell says: I love eating toasted cheese and tuna sandwiches.');
    
//     // pushMessage('Does Mike show any resistance? (( Jane Patterson ))', 'orchid', false, 'sound');
//     // pushMessage('None (( Mike Schwartz ))', 'orchid', false, 'sound');
// });

// $(window).keyup((event) => {
//     const key = event.code;

//     if (inputActive === false) {
//         switch (key) {
//             case 'KeyT':
//                 console.log('Open input');
//                 activateInput(true);
//                 event.preventDefault();
//                 break;
//         }
//     } else {
//         switch (key) {
//             case 'Enter':
//                 console.log('enter');
//                 submitInputBar();
//                 break;
//         }
//     }
    
//     switch(key) {
//         case 'PageUp':
//             scrollMessagesList('up');
//             break;
//         case 'PageDown':
//             scrollMessagesList('down');
//             break;
//     }
// });