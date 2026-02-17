module.exports = function () {
    const bot = require("../bot")

    const tool = bot.item.of("diamond_axe")
    const wheat = bot.item.of("wheat")
    const seed = bot.item.of("wheat_seeds")

    bot.item.select(tool, 0)

    bot.action.complex.do_field(124, bot.dir.SOUTH, 88, bot.dir.EAST, [wheat, seed], true)
}
