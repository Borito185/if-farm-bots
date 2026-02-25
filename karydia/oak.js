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
    for (let i = 0; i < rows /2; i++) {
        do_row2(bot.dir.NORTH)
    }

    bot.action.move_mine(bot.dir.EAST, 4, true, 0)

    function do_row2(start_dir) {
        do_tree(start_dir, offset)
        for (let i = 0; i < cols-1; i++) {
            do_tree(bot.dir.WEST, offset)
        }

        do_tree(bot.dir.NORTH, offset)
        for (let i = 0; i < cols-1; i++) {
            do_tree(bot.dir.EAST, offset)
        }
    }
}

