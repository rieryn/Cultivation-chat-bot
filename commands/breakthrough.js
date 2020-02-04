const players = require("../models/players.js");
const breakthrough_xp = 1000;

module.exports = {
	name: 'breakthrough',
	description: '!',
    help: "attempt to breakthrough to the next level!",

	execute(msg, args) {
	players.findOne({
    userID: msg.author.id,
    serverID: msg.guild.id
  }, (err, res) => {
    if (err) console.log(err);

    if (!res) {
		msg.channel.send('not registered')
    } else if (res.xp<breakthrough_xp) {
    	console.log(res);
 		msg.reply('Not enough cultivation base to breakthrough!')
    }
    else {
        res.xp = res.xp-breakthrough_xp;
        res.level = res.level + 1;
        res.save()
        msg.reply('You have successfully broken through to '+res.level+' !')

    }

		msg.reply(msg, args);
        msg.channel.send('pong');
	})
}

}