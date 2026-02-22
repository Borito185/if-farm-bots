user = {
    chat_prefix: "/g bozos",
    do_discord_ping: true,
    discord_handle: "<@450908675457024001>",
    log_level: 0,
    option1_key: "key.keyboard.y",
    option2_key: "key.keyboard.n"
}

const debug = true

const File = Java.type("java.io.File");
const Files = Java.type("java.nio.file.Files");
const StandardCopyOption = Java.type("java.nio.file.StandardCopyOption");
const URL = Java.type("java.net.URL");
const ZipInputStream = Java.type("java.util.zip.ZipInputStream");
const BufferedInputStream = Java.type("java.io.BufferedInputStream");
const BufferedOutputStream = Java.type("java.io.BufferedOutputStream");
const FileOutputStream = Java.type("java.io.FileOutputStream");

function deleteDir(file) {
    if (file.isDirectory()) {
        const files = file.listFiles()
        if (files) for (let f of files) deleteDir(f)
    }
    file.delete()
}

function readFileIfExists(path) {
    const f = path.toFile()
    if (!f.exists()) return null
    return new java.lang.String(
        Files.readAllBytes(path),
        java.nio.charset.StandardCharsets.UTF_8
    )
}

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

    const mcDir = Paths.get("").toAbsolutePath()
    const tempDir = mcDir
        .resolve("config")
        .resolve("jsMacros")
        .resolve("cache")
        .resolve(repo)

    Files.createDirectories(tempDir)

    const versionPath = tempDir.resolve("version.txt")
    const storedVersion = readFileIfExists(versionPath)
    const latestVersion = release.tag_name

    // 🔹 If same version → skip download
    if (storedVersion && storedVersion.trim() === latestVersion) {
        return tempDir.toString()
    }

    // 🔹 Clean old cache
    const dirFile = tempDir.toFile()
    if (dirFile.exists()) deleteDir(dirFile)
    Files.createDirectories(tempDir)

    const zipPath = tempDir.resolve("source.zip")

    const inStream = new URL(release.zipball_url).openStream()
    Files.copy(inStream, zipPath, StandardCopyOption.REPLACE_EXISTING)
    inStream.close()

    const zis = new ZipInputStream(
        new BufferedInputStream(Files.newInputStream(zipPath))
    );

    let entry;
    let rootFolder = null;

    while ((entry = zis.getNextEntry()) !== null) {
        const name = entry.getName();

        // detect root folder once
        if (!rootFolder)
            rootFolder = name.split("/")[0];

        // strip root folder from path
        let stripped = name.substring(rootFolder.length + 1);

        if (!stripped) continue; // skip empty root entry

        const outPath = tempDir.resolve(stripped);

        if (entry.isDirectory()) {
            Files.createDirectories(outPath);
        } else {
            Files.createDirectories(outPath.getParent());

            const out = new BufferedOutputStream(
                new FileOutputStream(outPath.toFile())
            );

            let b;
            while ((b = zis.read()) !== -1)
                out.write(b);

            out.close();
        }
    }

    zis.close();

    // save version
    Files.writeString(versionPath, latestVersion);

    Chat.log(tempDir.toString())

    return tempDir.toString();
}

function runFromLatest(owner, repo, entryFile) {
    if (debug) return require("./"+entryFile)
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
