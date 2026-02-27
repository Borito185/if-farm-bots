const bot = require("../bot");
module.exports = function () {
    const bot = require("../bot")
    const do_tree = bot.action.complex.do_tree({
        do_grow: false,
        sapling: bot.item.of("oak_sapling"),
        tool: bot.item.of('diamond_axe'),
        mine_time: 1650
    })

    let cols=16, rows=32, offset=5

    bot.progress.init(cols * rows)

    bot.action.center()
    do_row2(bot.dir.WEST)
    for (let i = 0; i < (rows /2 -1); i++) {
        do_row2(bot.dir.NORTH)
    }

    bot.action.move_mine(bot.dir.SOUTH, (rows-1) * offset, true, 0)
    bot.action.move(bot.dir.EAST, offset)

    function do_row2(start_dir) {
        do_tree(start_dir, offset)
        for (let i = 0; i < cols-1; i++) {
            do_tree(bot.dir.WEST, offset)
        }

        do_tree(bot.dir.NORTH, offset)
        for (let i = 0; i < cols-1; i++) {
            do_tree(bot.dir.EAST, offset)
        }

        bot.look.towards(bot.dir.WEST + 15, 50)
        bot.item.drop_all_of(bot.item.of("oak_log"))
        bot.item.drop_all_of(bot.item.of("apple"))
    }
}

