// perms: PUBLIC
// produces: ~45 ci Vines
// requires: 32 iron
// time: 35m
// downtime: 12h
// location: -2908, 74, 8042  | /dest imperial aethia
// notes: compactor in the nether on IF-XP

module.exports = function () {
    const bot = require("../bot")

    let row_length = 15, row_offset = 3;
    let rows = 8;
    let layers = 7;

    let shears = bot.item.of("shears")
    let target_item = bot.item.of("vine")

    bot.progress.init(rows * layers * 4)

    bot.action.center()
    bot.action.elevator(layers-1)

    for (let i = 0; i < layers; i++) {
        do_layer()

        if (i < layers-1) {
            bot.action.center()
            bot.action.elevator(-1)
        }
    }

    function do_layer() {
        for (let row = 0; row < rows; row++) {
            do_row();
        }

        bot.action.move(bot.dir.SOUTH, row_offset * rows - 2);
        bot.look.towards(bot.dir.EAST, 30)
        bot.action.wait(200)
        bot.item.drop_all_of(target_item)
        bot.action.move(bot.dir.SOUTH, 2);
    }

    function do_row() {
        if(bot.item.count(shears) <= 1) {
            bot.item.craft(shears)
        }

        bot.action.move(bot.dir.EAST, 1);
        do_sweep(bot.dir.EAST, row_length + 1, bot.dir.NORTHWEST, 45);
        do_sweep(bot.dir.WEST, row_length + 2, bot.dir.NORTHWEST, 8);

        bot.action.move(bot.dir.NORTH, row_offset);

        bot.action.move(bot.dir.EAST, 1);
        do_sweep(bot.dir.EAST, row_length + 1, bot.dir.SOUTHWEST, 45);
        do_sweep(bot.dir.WEST, row_length + 2, bot.dir.SOUTHWEST, 8);
    }

    function do_sweep(direction, len, lookDir, pitch) {
        bot.item.select(shears, 0)
        bot.look.towards(lookDir, pitch)
        bot.input.set([bot.input.ATTACK, bot.input.SNEAK])

        bot.action.move(direction, len)

        bot.input.release_all()
        bot.progress.increment()
    }
}
