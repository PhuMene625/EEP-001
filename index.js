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
//Serveur HTTP
const http = require('http');
const fs = require('fs');
const path = require('path');

const serveFile = (res, filePath) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
};

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>Welcome</h1><p><a href="/terms-of-service">Terms of Service</a></p><p><a href="/privacy-policies">Privacy Policy</a></p></body></html>');
    } else if (req.url === '/terms-of-service') {
        serveFile(res, path.join(__dirname, 'terms-of-service/index.html'));
    } else if (req.url === '/pricacy-policies') {
        serveFile(res, path.join(__dirname, 'privacy-policies/index.html'));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000/');
});


client.login(process.env.TOKEN);
