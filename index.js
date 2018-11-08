const discord = require("discord.js");
const botConfig = require("./botconfig.json");

const fs = require("fs");

const bot = new discord.Client();
bot.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) console.log(err);

  let jsFiles = files.filter(f => f.split(".").pop() === "js");

  if (jsFiles.length <= 0) {
    console.log("No files found in commands");
    return;
  }

  jsFiles.forEach((f, i) => {
    let fileGet = require(`./commands/${f}`);
    console.log(`The file ${f} has succesfully loaded!`);

    bot.commands.set(fileGet.help.name, fileGet);
  });
});

bot.on("ready", async () => {
  console.log(`${bot.user.tag} is now active!`);

  bot.user.setActivity("Testing Features", { type: "PLAYING" });
});

bot.on("message", async message => {
  //If a bot sends message then 'return'
  if (message.author.bot) return;

  if (message.channel.type === "dm") return;

  let prefix = botConfig.botPrefix;

  let messageArray = message.content.split(" ");

  let command = messageArray[0];

  let arguments = messageArray.slice(1);

  let commands = bot.commands.get(command.slice(prefix.length));

  if (commands) commands.run(bot, message, arguments);
});

bot.login(botConfig.token);
