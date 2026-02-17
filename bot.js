const { Event } = require("./lib/util")
const user = require("./user")
bot_state = {
    on_repeat: new Event(),
    farm_name: null,
    user,
    PLAYER: Player.getPlayer(),
    INVENTORY: Player.openInventory()
}

const { look } = require("./lib/look")
const { move } = require("./lib/move")
const { input } = require("./lib/input")
const { item } = require("./lib/item")
const { dir } = require("./lib/directions")
const { math } = require("./lib/math")
const { logger } = require("./lib/logging")
const { control } = require("./lib/control")
const { action } = require("./lib/action")
const { progress } = require("./lib/progress")

module.exports = {
    start(farm_name=null) {
        logger.info("Started farming!");
        bot_state.farm_name = farm_name
        if (bot_state.farm_name !== null) {
            Chat.say("/g IF-AgribotUpdates " + bot_state.farm_name + " | started")
        }
    },
    finish() {
        logger.alert("Finished farming!");
        Chat.say("/logout");

        if (bot_state.farm_name !== null) {
            Chat.say("/g IF-AgribotUpdates " + bot_state.farm_name + " | finished")
            bot_state.farm_name = null
        }
    },

    look,
    move,
    input,
    item,
    dir,
    math,
    control,
    logger,
    action,
    progress
}
