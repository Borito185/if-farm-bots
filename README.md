# IF farm bots

## Getting Started
1. Install the [JS Macros SE](https://modrinth.com/mod/jsmacrosce) mod.
2. Navigate to `{minecraft}/config/jsMacros/Macros/`.
3. Download the zip and unpack it here.
4. in game press 'k' to open up the JS Macros menu and bind `run.js` to a key
5. Walk to one of the designated blocks for the farm and press the keybind to start the bot!

## Using the bot
Move to a predetermined spot in game and activate the script. 
It will then start doing the farm automatically.
You can pause the script by reactivating it.
To unpause, reactivate it a last time.

## Making new bots
Best is to rely on `bot.js`. You use it by starting with:
```js
const bot = require("../bot.js")
```

These are the more important helper funcs on the bot:
- `bot.progress.init/increment`: Adds an estimated time for when the bot shall be finished.
- `bot.logging`: contains logging helper funcs, including pinging on discord
- `bot.actions`:
  - `bot.actions.move`: move to a position
  - `bot.actions.move_mine`: move to a position and mine blocks in the way
  - `bot.actions.center`: move to center of current block
  - `bot.actions.elevator(x)`: assume current block is an elevator and go up/down by provided x
  - `bot.actions.wait`: wait for given milliseconds
  - `bot.actions.mine/interact`: right/left click for a bit towards a given direction
  - `bot.actions.complex`: Higher level functions. Currently only has one for doing a large crop field and a single tree.
- `bot.look`: specify what the bot should look at. persists unless respecified.
- `bot.input`: manipulates what the bot should hold
- `bot.item`: provides helper funcs for working with items such as: `find`, `select`, `craft`, `drop_all_of`.
