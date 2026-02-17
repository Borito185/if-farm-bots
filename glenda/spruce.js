module.exports = function () {
    const bot = require("../bot");

    let rows = 21, cols = 28, offset = 6

    let tool = bot.item.of('diamond_axe')
    let sapling = bot.item.of("spruce_sapling")
    let log = bot.item.of("spruce_log")

    const do_tree = bot.action.complex.do_tree({do_grow: false, tool, mine_time: 2000, sapling})

    bot.progress.init(cols * rows)

    do_row(bot.dir.NORTH, bot.dir.WEST, 1)
    for (let i = 0; i < rows - 1; i++) {
        let row_dir = i % 2 === 1 ? bot.dir.NORTH : bot.dir.SOUTH;
        do_row(row_dir, bot.dir.WEST)
    }

    if (rows % 2 === 1)
        bot.action.move_mine(bot.dir.SOUTH, (cols - 1) * offset, true, 0)
    bot.action.move_mine(bot.dir.EAST, (rows - 1) * offset + 4, true, 0)

    function do_row(row_dir, start_dir, start_dist = offset) {
        do_tree(start_dir, start_dist)
        for (let i = 0; i < cols - 1; i++) {
            do_tree(row_dir, offset)
        }

        bot.look.towards(row_dir, 0)
        bot.input.set([bot.input.ATTACK])
        bot.action.wait(400)
        bot.input.set([])

        bot.look.towards(row_dir, 65)
        bot.item.drop_all_of(log)
    }
}
