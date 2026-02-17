module.exports = function () {
    const bot = require("../bot")
    const do_tree = bot.action.complex.do_tree({
        do_grow: true,
        grow_time: 2000,
        sapling: bot.item.of("jungle_sapling"),
        tool: bot.item.of('diamond_axe'),
        mine_time: 900
    })

    let cols=15, rows=13, offset=5

    bot.progress.init(cols * rows * 2)

    bot.action.center()
    do_row(bot.dir.WEST)
    for (let i = 0; i < rows - 1; i++) {
        do_row(bot.dir.NORTH)
    }

    bot.action.move(bot.dir.EAST, 4)

    function do_row(start_dir) {
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

