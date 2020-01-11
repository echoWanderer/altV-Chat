// Settings
var _MAX_MESSAGES_ON_CHAT = 10;
var _HIDE_INPUT_BAR_ON_BLUR = true;
var _SCROLL_TIME = 500;

// Data
var chatActive = false;
var inputActive = false;
var scrollActive = false;

// Elements
var chatBox = $('.chat-box');
var chatMessagesList = $('.chat-box .chat-messages-list');
var chatInputBar = $('.chat-box .chat-input-bar');
var chatInputBarLength = $('.chat-box .chat-input-bar-length');
var chatNewMessagesWarning = $('.chat-box .chat-new-messages-warning');

// Initiation
$(document).ready(() => {
    const messagesListHeight = _MAX_MESSAGES_ON_CHAT * 22.5;
    const chatBoxHeight = messagesListHeight + 50;

    chatBox.css('height', chatBoxHeight + 'px');
    chatMessagesList.css('height', messagesListHeight + 'px');
});
if (_HIDE_INPUT_BAR_ON_BLUR) $(chatInputBar).focusout(() => inputActive && toggleInputBar(false));
chatMessagesList.bind('mousewheel DOMMouseScroll', (e) => e.preventDefault());
chatInputBar.bind('propertychange change click keyup input paste', () => inputActive && countInputBarLength());

setInterval(() => console.log(getScrolledUpMessagesAmount()), 250);

// Functions - Actions
function pushMessage(text, color = 'white', gradient = false, icon = false) {
    if (text.length < 1) return;
    if (gradient !== false && Array.isArray(gradient) === false) return;

    let style = `color:${color};`

    if (gradient)
        style += `background:linear-gradient(90deg,rgba(${[gradient[0],gradient[1],gradient[2]]},0.3) 0%, rgba(255,255,255,0) 100%);`;

    if (icon)
        text = `<i class="fi-${icon}" style="padding-right:2px"></i> ` + text;

    chatMessagesList.append(`<div class="chat-message" style="${style}">${text}</div>`);

    (getScrolledUpMessagesAmount() >= 4) ? toggleWarningText(true) : scrollMessagesList('bottom');
}

function scrollMessagesList(direction) {
    if (scrollActive) return;

    scrollActive = true;
    setTimeout(() => scrollActive = false, _SCROLL_TIME + 5);

    const pixels = 22.5 * 5;

    switch (direction) {
        case 'up':
            chatMessagesList.stop().animate({ scrollTop: `-=${pixels}px` }, _SCROLL_TIME);
            break;
        case 'down':
            chatMessagesList.stop().animate({ scrollTop: `+=${pixels}px` }, _SCROLL_TIME);
            break;
        case 'bottom':
            chatMessagesList.stop().animate({ scrollTop: chatMessagesList.prop('scrollHeight') }, _SCROLL_TIME);
            break;
    }

    setTimeout(() => {
        if (getScrolledUpMessagesAmount() == 0) toggleWarningText(false);
    }, _SCROLL_TIME);
}

function toggleChatBox() {
    chatActive = !chatActive;
    chatBox.toggleClass('hide');
}

function toggleInputBar(state) {
    inputActive = state;

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
}

function submitInputBar() {
    const message = chatInputBar.val();
    pushMessage(message);

    chatInputBar.val('');
    toggleInputBar(false);
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

function countInputBarLength() {
    console.log('woop');
    const length = chatInputBar.val().length;

    chatInputBarLength.html(`<i class="fi-pencil" style="padding-right:2px"></i> ${length}/100`);
}

// Functions - Checks

function getScrolledUpMessagesAmount() {
    const amount = Math.round((chatMessagesList.prop('scrollHeight') - chatMessagesList.scrollTop() - _MAX_MESSAGES_ON_CHAT * 22.5) / 22.5);
    return (amount > 0) ? amount : 0;
}

/**
 *  ONLY FOR TESTING IN BROWSER
 */

$(document).ready(() => {
    pushMessage('Todd Chapman says: Did you know that, along with gorgeous architecture, it’s home to the largest tamale?');
    pushMessage('Norman Butler says: A song can make or ruin a person’s day if they let it get to them.');
    pushMessage('Elizabeth Flowers says: I will never be this young again. Ever. Oh damn… I just got older.');

    pushMessage('You entered wrong password!', 'tomato', [140, 0, 0], 'x');

    pushMessage('Roy Powell says: I love eating toasted cheese and tuna sandwiches.');
    pushMessage('Jane Patterson looks to the man and chuckles.', 'orchid', false, 'sound');

    pushMessage('[AD] Young male (24) is looking for a well-paid job. Has experience in accounting, managing and doing nothing. Would start right away! [Ph. #486347]', 'limegreen', [0, 140, 0], 'telephone');

    pushMessage('Deanna Harmon says: He had reached the point where he was paranoid about being paranoid.');

    pushMessage('You report [#405] was submited successfully. Please wait for a staff member to accept it.', 'lawngreen', [0, 200, 0], 'check');

    pushMessage('Billy Holmes says: I will never be this young again. Ever. Oh damn… I just got older.');
    pushMessage('Marcos Murray says: He said he was not there yesterday; however, many people saw him there. I really want to go to work, but I am too sick to drive.');
    pushMessage('Matthew Garrett says: My Mum tries to be cool by saying that she likes all the same things that I do.');

    pushMessage('PM to Billy Holmes [32]: Wow, does that work? ))', 'goldenrod', false, 'mail');

    pushMessage('Todd Chapman says: Did you know that, along with gorgeous architecture, it’s home to the largest tamale?');
    pushMessage('Norman Butler says: A song can make or ruin a person’s day if they let it get to them.');

    pushMessage('PM from Billy Holmes [32]: Yup, it sure does, kiddo! ))', 'gold', [225, 215, 0], 'page');

    pushMessage('Elizabeth Flowers says: I will never be this young again. Ever. Oh damn… I just got older.');
    pushMessage('Deanna Harmon says: He had reached the point where he was paranoid about being paranoid.');
    pushMessage('Roy Powell says: I love eating toasted cheese and tuna sandwiches.');
    
    pushMessage('Does Mike show any resistance? (( Jane Patterson ))', 'orchid', false, 'sound');
    pushMessage('None (( Mike Schwartz ))', 'orchid', false, 'sound');
});

$(document).keyup((event) => {
    const key = event.code;

    if (inputActive === false) {
        switch (key) {
            case 'KeyT':
                console.log('Open input');
                toggleInputBar(true);
                event.preventDefault();
                break;
        }
    } else {
        switch (key) {
            case 'Enter':
                console.log('enter');
                submitInputBar();
                break;
        }
    }
    
    switch(key) {
        case 'PageUp':
            scrollMessagesList('up');
            break;
        case 'PageDown':
            scrollMessagesList('down');
            break;
    }
});