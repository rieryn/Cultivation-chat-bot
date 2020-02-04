//mongo reqs
const mongo = require('mongodb').Mongobot
const mongo_connection_string = 'mongodb://localhost:27017'
const mongoose = require("mongoose");

//discord reqs
const Discord = require('discord.js');
const bot = new Discord.Client();
const auth = require('./auth.json');
const PREFIX = '!';
const fs = require("fs");
bot.commands = new Discord.Collection();
//other reqs
require("console-stamp")(console);

//internal reqs
const players = require("./models/players.js");




//init
bot.login(auth.token);
mongoose.connect(mongo_connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true

});

/*mongo.connect(mongo_connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, bot) => {

  if (err) {
    console.error(err)
    return
  }
    const db = bot.db('members');
    const collection = db.collection('player')
    collection.insertOne({name: 'test'}, (err, result) => {

})
collection.find().toArray((err, items) => {
  console.log(items)
})
  //...
})*/

//init command handler
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
	console.log(bot.commands)
}

//run
bot.on("ready", () => {
  bot.user.setActivity("!help", {type: "PLAYING"})
  console.log(`Logged in as ${bot.user.tag}!`)
});


bot.on("message", async message => {
  if (message.author.bot) return;
  if (!message.channel.guild) return;
  

  const prefix = PREFIX;
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (message.content.startsWith(prefix)) {
  		//console.log(commandName)
	if (!bot.commands.has(commandName)) return;
	const command = bot.commands.get(commandName);
	console.log(message.createdTimestamp)

  	//first update the time based xp every time the bot is called, or create a new player
      players.findOne({
        userID: message.author.id,
        serverID: message.guild.id
      }, (err, res) => {
        if(err) console.log(err);

        if(!res){
          const newDoc = new players({
            userID: message.author.id,
            username: message.author.username,
            serverID: message.guild.id,
            xp: 0,
            lastTimestamp: message.createdTimestamp,
            level: 1
          })
          newDoc.save().catch(err => console.log(err));
        }else{
          res.xp = res.xp + (message.createdTimestamp - res.lastTimestamp)/10000;
          res.save().catch(err => console.log(err))
        }
      })
       try {
            command.execute(message, args);
	 	 } catch (err) {
	   	 console.warn('Error handling command');
	   	 console.warn(err);
	  		}
  	 
}
});