// perms: IF-XP
// produces: 17 ci jungle logs, 8ci saplings
// requires: half durability axe, stick, 5 stacks of jungle saplings
// time: 50m
// downtime: 12h
// location: -8931, 107, 2381  | /dest karydia barbietown

module.exports = function () {
    const bot = require("../bot")
    let tool = bot.item.of('diamond_axe')
    let stick = bot.item.of('stick')
    let sapling = bot.item.of("jungle_sapling")
    let log = bot.item.of("jungle_log")

    let rows=32, cols=16, offset=5;
    let mine_time = 1650;

    const do_tree = bot.action.complex.do_tree({tool, sapling, mine_time})

    bot.progress.init(cols * rows * 2 - 1)


    do_tree(bot.dir.NORTH, 5)
    do_layer()

    bot.look.forward()
    bot.action.move_mine(bot.dir.EAST, (rows-1)*offset, true, 0)
    bot.action.move_mine(bot.dir.NORTH, 1, true, 0)
    bot.action.elevator(1)

    do_layer()
    bot.look.forward()
    bot.action.move_mine(bot.dir.EAST, (rows-1)*offset, true, 0)
    bot.action.elevator(-1)
    bot.action.move_mine(bot.dir.SOUTH, 6, true, 0)

    function do_layer() {
        do_row(bot.dir.NORTH, cols-1)
        for (let i = 0; i < rows -1; i++) {
            do_tree(bot.dir.WEST, offset)

            do_row(i % 2 === 0 ? bot.dir.SOUTH : bot.dir.NORTH, cols-1)
        }
    }

    function do_row(direction, n) {
        for (let i = 0; i < n; i++) {
            do_tree(direction, offset)
        }

        bot.item.select(stick, 1)
        bot.action.mine(direction, 0, 1000)

        bot.look.towards(direction +15, 60)
        bot.item.drop_all_of(log)
    }
}
