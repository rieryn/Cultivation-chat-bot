const players = require("../models/players.js");


module.exports = {
	name: 'ping',
	description: 'Ping!',
    help: "Send a Pong!",

	execute(msg, args) {
	players.findOne({
    userID: msg.author.id,
    serverID: msg.guild.id
  }, (err, res) => {
    if (err) console.log(err);

    if (!res) {
		msg.channel.send('not registered')
    } else {
    	console.log(res);
 		msg.reply(res.xp)
    }

		msg.reply(msg, args);
        msg.channel.send('pong');
	})
}

}