const bot = require("./bot")

bot.add_farm(-4783, 161, 7789, null, require("./glenda/spruce"))
bot.add_farm(-4921, 123, 7824, null, require("./glenda/sweetberry"))
bot.add_farm(-8619, 68, 1349, null, require("./snapper/jungle"))
bot.add_farm(-9527, 68, 2419, "Karydia Wheat", require("./karydia/wheat"))
bot.add_farm(-8931, 107, 2381, "Karydia Jungle", require("./karydia/jungle"))
bot.add_farm(-3281, 120, 8037, null, require("./nether/warped"))
bot.add_farm(-3281, 85, 8037, null, require("./nether/warped"))
bot.add_farm(-3281, 50, 8037, null, require("./nether/warped"))
bot.add_farm(-2995, 79, 9116, null, require("./florabis/potato"))
bot.add_farm(-2908, 74, 8042, null, require("./aethia/vines"))

function is_already_running() {
    const current = context.file

    return JsMacros.getOpenContexts()
        .filter(ctx => ctx.file === current)
        .length > 1
}

if (is_already_running()) {
    bot.toggle_paused()
} else {
    bot.toggle_paused(false)
    bot.run_farm()
}
