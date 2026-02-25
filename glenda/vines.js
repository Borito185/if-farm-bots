const bot = require("../bot");
module.exports = function () {
    const bot = require("../bot")
    const shears = bot.item.of("shears")
    const vines = bot.item.of("vine")
    const layers = 4
    const length = 80

    function drop_vines() {
        bot.look.towards(bot.dir.NORTH, 0)
        bot.item.drop_all_of(vines)
    }

    function do_sweep(move_dir, yaw, pitch) {
        bot.item.select(shears, 0)
        bot.look.towards(yaw, pitch)
        bot.input.set([bot.input.ATTACK, bot.input.SNEAK])
        bot.action.move(move_dir, length)
        bot.input.release_all()
    }

    function do_layer() {
        bot.action.move(bot.dir.WEST, 1)

        do_sweep(bot.dir.WEST, 130, 20)
        do_sweep(bot.dir.EAST, -130, 14)
        do_sweep(bot.dir.WEST, 111, -21)
        drop_vines()

        do_sweep(bot.dir.EAST, -130, 20)
        do_sweep(bot.dir.WEST, 126, -7)

        do_sweep(bot.dir.EAST, -130, 5)

        bot.move.toggle_diagonal(false)
        do_sweep(bot.dir.WEST, 179, 30)
        drop_vines()
        bot.move.toggle_diagonal(true)
        bot.look.towards(bot.dir.NORTH, 0)
        bot.action.move(bot.dir.EAST, length)
    }

    function up() {
        let old_target = bot.move.target
        let target_y = Math.floor(Player.getPlayer().getY()) + 5
        bot.input.add(bot.input.SNEAK)
        bot.move.toDir(bot.dir.EAST, 1)
        bot.control.loop(() => Player.getPlayer().getY() < target_y - .1)
        bot.input.remove(bot.input.SNEAK)
        bot.move.target = old_target
    }

    bot.action.center()
    bot.action.move(bot.dir.NORTH, 1)

    for (let i = 0; i < layers; i++) {
        do_layer()

        if (i < layers-1) {
            up()
        }
    }
    
    do_layer()
}

