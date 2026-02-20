const { Event } = require("./lib/util")
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

const farms = []
let farm_depth = 0

function start(farm_name=null) {
    farm_depth++;
    if (farm_depth === 1) logger.info("Started farming!");
    bot_state.farm_name = farm_name
    if (bot_state.farm_name !== null) {
        Chat.say("/g IF-AgribotUpdates " + bot_state.farm_name + " | started")
    }
}

function finish() {
    farm_depth--;
    if (farm_depth === 0) {
        logger.alert("Finished farming!");
        Chat.say("/logout");
    }

    if (bot_state.farm_name !== null) {
        Chat.say("/g IF-AgribotUpdates " + bot_state.farm_name + " | finished")
        bot_state.farm_name = null
    }
}

module.exports = {
    add_farm(x, y, z, name, script) {
        farms.push({
            pos: PositionCommon.createPos(x, y, z),
            name,
            script
        })
    },

     run_farm() {
         const pos = Player.getPlayer().getPos()
         pos.x = Math.floor(pos.x); pos.y = Math.floor(pos.y); pos.z = Math.floor(pos.z);

         const farm = farms.find(f =>
             f.pos.x === pos.x &&
             f.pos.y === pos.y &&
             f.pos.z === pos.z
         )

         if (!farm) {
             logger.debug("Farm not found. Make sure you are standing on the right block.")
             return
         }

         start(farm.name)

         try {
             farm.script()   // this works if the file exports a function
         } finally {
             finish()
         }
    },

    toggle_paused(new_value = !(GlobalVars.getBoolean("bot_is_paused") ?? false)) {
        GlobalVars.putBoolean("bot_is_paused", new_value)
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
