module.exports = function () {
    const bot = require("../bot")

    const rows = 80
    const cols = 81

    bot.action.complex.do_field(rows, bot.dir.WEST, cols, bot.dir.SOUTH, [bot.item.of("potato"), bot.item.of("poisonous_potato")])
}
