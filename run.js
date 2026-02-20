user = {
    chat_prefix: "/g bozos",
    do_discord_ping: true,
    discord_handle: "<@450908675457024001>",
    log_level: 0,
    option1_key: "key.keyboard.y",
    option2_key: "key.keyboard.n"
}

const File = Java.type("java.io.File");
const Files = Java.type("java.nio.file.Files");
const Paths = Java.type("java.nio.file.Paths");
const StandardCopyOption = Java.type("java.nio.file.StandardCopyOption");
const URL = Java.type("java.net.URL");
const ZipInputStream = Java.type("java.util.zip.ZipInputStream");
const BufferedInputStream = Java.type("java.io.BufferedInputStream");
const BufferedOutputStream = Java.type("java.io.BufferedOutputStream");
const FileOutputStream = Java.type("java.io.FileOutputStream");

/**
 * Downloads latest GitHub release, extracts it to temp folder,
 * and returns absolute path to extracted directory.
 *
 * @param {string} owner
 * @param {string} repo
 * @param {string|null} assetName  (optional, null = first asset)
 */
function downloadLatestSource(owner, repo) {
    const api = `https://api.github.com/repos/${owner}/${repo}/releases/latest`
    const connection = new URL(api).openConnection()
    connection.setRequestProperty("User-Agent", "JsMacros")

    const scanner = new java.util.Scanner(connection.getInputStream()).useDelimiter("\\A")
    const json = scanner.hasNext() ? scanner.next() : ""
    scanner.close()

    const release = JSON.parse(json)
    if (!release.zipball_url)
        throw "No release zipball found"

    const tempDir = Files.createTempDirectory("jsmacros_" + repo);
    Files.createDirectories(tempDir)

    const zipPath = tempDir.resolve("source.zip")

    // download default source zip
    const inStream = new URL(release.zipball_url).openStream()
    Files.copy(inStream, zipPath, StandardCopyOption.REPLACE_EXISTING)
    inStream.close()

    // extract
    const zis = new ZipInputStream(new BufferedInputStream(Files.newInputStream(zipPath)))
    let entry
    let rootFolder = null

    while ((entry = zis.getNextEntry()) !== null) {
        const name = entry.getName();

        if (!rootFolder)
            rootFolder = name.split("/")[0];

        const outPath = tempDir.resolve(name);

        if (entry.isDirectory()) {
            Files.createDirectories(outPath);
        } else {
            Files.createDirectories(outPath.getParent());

            const out = new BufferedOutputStream(
                new FileOutputStream(outPath.toFile())
            );

            // copy stream safely without manual buffer
            let b;
            while ((b = zis.read()) !== -1) {
                out.write(b);
            }

            out.close();
        }
    }

    zis.close()

    return tempDir.resolve(rootFolder).toString()
}

/**
 * Load entry script from downloaded release
 */
function runFromLatest(owner, repo, entryFile = "index.js") {
    const path = downloadLatestSource(owner, repo)
    return require(path + File.separator + entryFile)
}

const bot = runFromLatest("Borito185", "if-farm-bots", "bot.js")
runFromLatest("Borito185", "if-farm-bots", "farms.js")

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
