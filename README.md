# Alt:V Chat
**This resource still needs testing and improving. It's not ready to use in production.**

*Your contribution would be very appreciated! Please look for **Known issues** at the bottom of the page.*

## Features
* Global and player-based messages
* Colored messages
* Commands handling
* Toggle-able chat box visibility
* Messages history (scrolling with Arrow keys)
* Dynamic message length counter
* Built-in */help* command

## Showcase
![](https://i.ibb.co/4mtHpc6/2.png)
![](https://i.ibb.co/mtHmz5s/3.png)
![](https://i.ibb.co/wKBJp0T/4.png)
![](https://i.ibb.co/q0MQ55s/5.png)
![](https://i.ibb.co/T8sT37f/7.png)

## How to use

### Installation
1. Download this repository in ZIP package, unpack it to your server's `resources` folder.
2. Rename unpacked folder to `chat`.
3. Add resource as dependence to your main resource's config file. For example:
```
type: js,
main: server/index.mjs,
client-main: client/index.mjs,
client-files: [
	client/*
],
deps: [
	chat
]
```
---
### Server-side functionality
Function|Description
-|:-:
`showChat(player)`|Enables chat functionality for specified player
`hideChat(player)`|Disables chat functionality for specified player
`broadcast(text)`|Sends a message to all players
`output(player, text)`|Sends a message to specified player
`onCommand(...)`|Defines a command (*see below*)
---
### Client-side functionality
Function|Description
-|:-:
`showChat()`|Enables chat functionality for client
`hideChat()`|Disables chat functionality for client
`clearChat()`|Deletes all messages from chat for client
`addChatMessage(text)`|Sends a message to client
---
### Basic chat usage
* Connect to your server and press `T` key on your keyboard.
* Write any message and press `Enter` key on your keyboard.
* If you wan't to repeat your last message, just open chat input again (with `T` key) and press `Arrow Up` button. Your last message will appear in input box. Want to scroll further? Press `Arrow Up` again! Want to go back? Press `Arrow Down` until input box will be empty again.

**Something you should know**
1. If you entered a message and pressed `Arrow Up`, message will be saved. Press `Arrow Down` and your saved message will appear!
2. You can scroll through as many last messages as you want, just increase or decrease maximum number of cached messages in `client.mjs` file.
3. If you open input box and press anywhere outside it with your mouse, input box will hide and you'll control your player again.
4. You can close input box by pressing `ESC` key too.

 ---
### Creating your first command
To create a command, you have to define it by using `onCommand` function.
```
chat.onCommand(commandName, callback, requiredArgumentAmount, commandDescription, commandUsage);
```
Argument|Description
-|:-:
`commandName`: string|Sets name for a command which will be used to call it. 
`callback`: function|Function which will be called.
`requiredArgumentAmount`: int|How many arguments are required.
`commandDescription`: string|Text which will be used to describe command's functionality.
`commandUsage`: string|Arguments in a text form which will be used to help people understand what arguments does this command needs.

#### Example 1
```
chat.onCommand('ping', (player) => {
	chat.output(player, 'Pong!');
}, 0, 'Test it out and you will see.');
```
*Usage:* `/ping`

#### Example 2
```
chat.onCommand('ooc', (player, message) => {
	chat.broadcast(`[OOC] ${player.name}: ${message}`);
}, 1, 'Send a message to global OOC chat.', '[message]');
```
*Usage:* `/ooc Hey, It's my message!`

#### Example 3
```
chat.onCommand('ooc', (player, color, message) => {
	chat.broadcast(`{${color}}[OOC] ${player.name}: ${message}`);
}, 2, 'Send a message to global OOC chat.', '[color] [message]');
```
*Usage:* `/ooc FFBBCC Hey, It's my message!`

## Known Issues
1. There is some lag between events, you can see warning messages in server and client console:
`Event handler at chat:file:///_/chat/server.mjs:5 was too long 16ms`
`Event handler at chat:client.mjs:65 was too long 21ms`
2. Sometimes after reconnecting to server your client halts and few seconds later - crashes.
