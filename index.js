const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const prefix = "!"; 
const lineRooms = new Map();


const defaultLineLink = 'https://cdn.discordapp.com/attachments/1283379165504081941/1331364026042814464/falcon_dividier.png?ex=679158df&is=6790075f&hm=903d62f1735f3c440d889d24be0a720663bbe9991e204b77431fe44295b66e59&';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'addline') {
    const channelID = args.shift();
    const channel = message.guild.channels.cache.get(channelID);

    if (channel && channel.isText()) {
      const lineLink = args.join(' ') || defaultLineLink;
      lineRooms.set(channel.id, lineLink);
      message.channel.send(`تم إضافة الخط التلقائي للروم: ${channel}`);
    } else {
      message.channel.send('يرجى تحديد روم نصي صحيح.');
    }
  }

  if (command === 'removeline') {
    const channelID = args.shift();
    if (lineRooms.has(channelID)) {
      lineRooms.delete(channelID);
      message.channel.send(`تم حذف الروم من الخط التلقائي.`);
    } else {
      message.channel.send('الروم المحدد ليس جزءًا من الخط التلقائي.');
    }
  }
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  
  if (lineRooms.has(message.channel.id)) {
    const lineLink = lineRooms.get(message.channel.id);
    message.channel.send(lineLink);
  }
});
      

const TOKEN = 'MTI5NTg1MzE4NjQyNjQ3NDU0Ng.G8ec-8.5LKv__kTtCsRgr9gIJ4hUSvHvH1Wc5xvxSn5ZU';
client.login(TOKEN);