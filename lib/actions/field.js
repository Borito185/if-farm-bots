module.exports = function (rows, row_dir, cols, col_dir, to_drop, init_progress=true) {
    const bot = require("../../bot");

    if (init_progress) {
        bot.progress.init(rows+2)
    }


    function apply_crop_offset(intended_move_direction) {
        bot.action.center()

        let direction = bot.dir.tangent(intended_move_direction, bot.dir.NORTHWEST)
        let back = bot.dir.turn_back(intended_move_direction)
        direction = bot.dir.between(back, direction)

        bot.action.move(direction, 0.3, false)
    }

    function do_row(row_dir, length, yaw, pitch) {
        apply_crop_offset(row_dir, length)

        bot.look.towards(yaw, pitch)
        bot.input.set([bot.input.USE])
        bot.action.move(row_dir, length + 0.5, false)
        bot.input.release_all()
        bot.progress.increment()
    }

    function drop_all(direction) {
        bot.look.towards(direction, 0)
        to_drop.forEach(bot.item.drop_all_of)
    }

    const back_row_dir = bot.dir.turn_back(row_dir)

    do_row(row_dir, cols, col_dir, 90)
    do_row(back_row_dir, cols, col_dir, 45)
    drop_all(back_row_dir)

    for (let i = 0; i < rows/2; i++) {
        do_row(row_dir, cols, col_dir, 35)
        bot.action.move(col_dir, 1)
        do_row(back_row_dir, cols, col_dir, 35)
        drop_all(back_row_dir)
        bot.action.move(col_dir, 1)
    }
}
