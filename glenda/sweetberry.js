module.exports = function () {
    const bot = require("../bot")

    const tool = bot.item.of("diamond_axe")
    const berry = bot.item.of("sweet_berries")

    for (let i = 0; i < 13; i++) {
        do_bar()
    }


    function do_row(dir, dist) {
        bot.action.center()
        bot.action.move(dir - 90, 0.24, false)

        bot.item.select(tool, 0)
        bot.action.interact(dir - 90, 70, 100)
        bot.action.interact(dir - 30, 50, 100)
        bot.action.interact(dir - 15, 30, 100)
        bot.action.interact(dir - 8, 20, 150)

        bot.move.toggle_diagonal(false)
        bot.look.towards(dir - 5, 15)
        bot.input.add(bot.input.USE)
        bot.action.move(dir, dist)
        bot.input.remove(bot.input.USE)
        bot.move.toggle_diagonal(true)

        bot.progress.increment()
    }

    function do_bar() {
        bot.action.move(bot.dir.NORTH, 1)
        do_row(bot.dir.NORTH, 201)

        bot.action.move(bot.dir.WEST, 3)

        bot.action.move(bot.dir.SOUTH, 1)
        do_row(bot.dir.SOUTH, 201)

        bot.look.towards(bot.dir.SOUTH, 0)
        bot.item.drop_all_of(berry)
    }
}
