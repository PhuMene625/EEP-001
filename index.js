const Discord = require("discord.js");
const intents = [];
for (const intent in Discord.GatewayIntentBits) {
  intents.push(Discord.GatewayIntentBits[intent]);
}
const client = new Discord.Client({ intents });
const whitelistRoleId = process.env.whitelist;
const ownerPing = process.env.ownerPing;
const pingkiller = process.env.pingkiller;
let log;
const ownerId = process.env.ownerId;

client.on("ready", () => {
  const startTime = Date.now();
  console.log(`Logged in as ${client.user.tag}!`);

  log = client.channels.cache.get(process.env.log);
  if (log) {
    const latency = Date.now() - startTime;
    log.send(
      `I'm UP! Latency is ${latency}ms. API Latency is ${Math.round(client.ws.ping)}ms`,
    );
  }
});

client.on("messageCreate", (message) => {
  if (message.content === "+ping") {
    console.log("PING FIRED");
    const startTime = Date.now();
    message.channel.send(`Pinging...`).then(() => {
      const latency = Date.now() - startTime;
      message.channel.send(
        `Latency is ${latency}ms. API Latency is ${Math.round(client.ws.ping)}ms`,
      );
    });
  }
});

client.on("messageCreate", (message) => {
  const whitelistRole = message.guild.roles.cache.get(whitelistRoleId);
if(message.author.id !== "1264616648124534907"){
  if (message.content.includes(ownerPing)) {
    if (message.member.roles.cache.has(whitelistRoleId)) {
      console.log(`User ${message.author.username} is whitelisted.`);
      log.send(`${message.author.username} est dans la liste blanche.`);
    } else {
      log.send(`<@${message.author.id}> ` + pingkiller);
    }
  }
}});


//ARRÊT D'URGENCE
client.on("messageCreate", (message) =>{
  if(message.author.id == ownerId){
    if (message.content == "+exit"){
      console.log("ARRET D'URGENCE");
      log.send("ARRET D'URGENCE");
      message.delete();
      setTimeout(() => client.destroy(), 2000)
      setTimeout(() => process.exit(), 5000)
    }
  }
}
  );
client.login(process.env.TOKEN);
