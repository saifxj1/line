
require("events").EventEmitter.defaultMaxListeners = 200;
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const express = require("express");
const db = require("quick.db");
const app = express();
client.cmds = new Discord.Collection();
const cmds = client.cmds;

app.listen(() => console.log("Server started"));

app.use('/ping', (req, res) => {
  res.send(new Date());
});

const prefix = "!"; // البرفيكس
client.prefix = prefix;

//STATUS CODE
client.on("ready", () => {
  console.log(`Logged As ${client.user.tag}`);
  client.user.setActivity(`${client.user.username} | ${prefix}help `, {
    type: "PLAYING"
  }); // حاله البوت
});


client.on("message", msg => onMessage(msg));

function onMessage(message) {

let args = message.content.split(" ")
let cmd = cmds.find(x => x.config.name == args[0].slice(prefix.length) || x.config.alis.includes(args[0].slice(prefix.length)) || x.config.alis.includes(args[0]));

cmd ? !message.content.startsWith(prefix) && !cmd.config.noprefixali ? null : cmd.run(client, message, args.slice(1), db) : null;

  return checkForEventCmds(message, args);
}

(function lod(dirs) {
  for (let dir of dirs) {
    for (let filename of fs
      .readdirSync("./commands/" + dir)
      .filter(d => d.includes(".js"))) {
      let fileprep = require("./commands/" + dir + "/" + filename);
      cmds.set(filename, fileprep);
    }
  }
})(["General", "Admin"]);

function checkForEventCmds(message, args) {
  let Ecmd = cmds.find(cmd => cmd.config.type == "messageEvent");
  if (Ecmd) Ecmd.run(client, message, args, db);
}



client.login(process.env.token);
