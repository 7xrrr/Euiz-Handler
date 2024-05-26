const client = require("../../index");



client.on("ready", async () => {
    const commands = await client.application.commands.set(client.slashCommands.map(d => ({
        name: d.name.toLowerCase().trim(),
        description: d.description,
        options: d.options,
        defaultPermission: d.defaultPermission
    }))).catch(err => console.error(err));
    console.log(commands.size + " slash commands registered")
})