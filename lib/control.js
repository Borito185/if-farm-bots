const { logger } = require("./logging")
const { input, unpress_all } = require("./input")

exports.control = {
     loop(while_condition) {
        let iter = 0;
        while (while_condition()) {
            Time.sleep(1)
            this.safe(() => bot_state.on_repeat.emit(iter))
            iter++;
        }
    },

    once() {
        this.safe(() => bot_state.on_repeat.emit(0))
    },

    safe(fn) {
        try {
            fn()
        } catch (e) {
            if (e.message === "Halting...") {
                logger.info(e)
            } else {
                logger.alert(e)
                logger.debug(e.stack)
                Chat.say("/logout")
            }

            logger.info("Restart by running the script again")
            logger.info("Current position: " + bot_state.PLAYER.getPos())
            unpress_all()
            while (GlobalVars.getBoolean("bot_is_paused") ?? false) {
                Time.sleep(100)
            }
            bot_state.PLAYER = Player.getPlayer()
            bot_state.INVENTORY = Player.openInventory()
            Time.sleep(1000)
            this.safe(fn)
        }
    }
}
