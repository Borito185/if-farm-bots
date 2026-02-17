const bot = require("./bot")
const farms = []

add_farm(-4783, 161, 7789, null, require("./glenda/spruce"))
add_farm(-8619, 68, 1349, null, require("./snapper/jungle"))
add_farm(-9527, 68, 2419, "Karydia Wheat", require("./karydia/wheat"))
add_farm(-8931, 107, 2381, "Karydia Jungle", require("./karydia/jungle"))
add_farm(-3281, 120, 8037, null, require("./nether/warped"))
add_farm(-3281, 85, 8037, null, require("./nether/warped"))
add_farm(-3281, 50, 8037, null, require("./nether/warped"))
add_farm(-2995, 79, 9116, null, require("./florabis/potato"))
add_farm(-2908, 74, 8042, null, require("./aethia/vines"))

function main() {
    if (isAlreadyRunning()) {
        const isPaused = GlobalVars.getBoolean("bot_is_paused") ?? false
        GlobalVars.putBoolean("bot_is_paused", !isPaused)
        if (isPaused) {
            bot.logger.info("Restarting...")
        }

        return
    }

    GlobalVars.putBoolean("bot_is_running", true)

    const player = Player.getPlayer()
    const pos = player.getPos()
    pos.x = Math.floor(pos.x)
    pos.y = Math.floor(pos.y)
    pos.z = Math.floor(pos.z)

    const farm = farms.find(f =>
        f.pos.x === pos.x &&
        f.pos.y === pos.y &&
        f.pos.z === pos.z
    )

    if (!farm) {
        bot.logger.debug("Farm not found. Make sure you are standing on the right block.")
        return
    }

    bot.start(farm.name)

    try {
        farm.script()   // this works if the file exports a function
    } finally {
        bot.finish()
    }
}

function isAlreadyRunning() {
    const current = context.file

    return JsMacros.getOpenContexts()
        .filter(ctx => ctx.file === current)
        .length > 1
}

function add_farm(x, y, z, name, script) {
    farms.push({
        pos: PositionCommon.createPos(x, y, z),
        name,
        script
    })
}

main()
