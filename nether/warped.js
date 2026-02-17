module.exports = function () {
    const bot = require("../bot")

    let rows = 12;
    let row_elements = 44;
    let element_offset = 3;

    let warped_stem = bot.item.of("warped_stem")
    let to_drop = [warped_stem, bot.item.of("warped_wart_block")]
    let bone_meal = bot.item.of("bone_meal")
    let sapling = bot.item.of("warped_fungus")
    let tool = bot.item.of("diamond_axe")

    bot.progress.init(rows * row_elements)

    do_layer()

    function do_layer() {
        for (let i = 0; i < rows / 2; i++) {
            do_row2(i === (rows / 2) - 1)
        }
        bot.input.set([bot.input.SNEAK])
        bot.action.move(bot.dir.SOUTH, (rows - 1) * element_offset)
        bot.input.release_all()
    }

    function do_row2(is_last) {
        for (let i = 0; i < row_elements - 1; i++) {
            do_tree(bot.dir.WEST)
        }
        do_tree(bot.dir.NORTH)
        for (let i = 0; i < row_elements - 1; i++) {
            do_tree(bot.dir.EAST)
        }

        for (let i of to_drop) {
            bot.look.towards(bot.dir.EAST, 0)
            bot.item.drop_all_of(i)
        }

        if (!is_last) {
            do_tree(bot.dir.NORTH)
        }
    }

    function do_tree(direction) {
        let target_pos = bot.dir.to_vec(direction).scale(element_offset)
        target_pos = Player.getPlayer().getPos().add(target_pos)
        target_pos = bot.math.centralize(target_pos)
        target_pos = target_pos.add(0, 1, 0)

        // move to tree & mine bottom
        bot.item.selectTool(tool, 0)
        bot.look.at(target_pos)
        bot.input.set([bot.input.ATTACK])
        bot.action.move(direction, element_offset)

        // mine top
        bot.look.towards(direction, -90)
        bot.action.wait(3400)
        bot.input.set([])

        // replant
        get_bone_meal()
        bot.action.interact(direction, 90, 150)

        bot.item.select(sapling, 2)
        bot.action.interact(direction, 90, 150)

        bot.progress.increment()
    }

    function get_bone_meal() {
        if (bot.item.count(bone_meal) < 3) {
            bot.item.craft(bone_meal)
        }
        bot.item.select(bone_meal, 1)
    }
}
