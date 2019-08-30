const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});

const Gamblers = "556864865214529551";

function addPoints (points, uid, amount, message)
{
    if(points[uid] == null) return false;

    if(points < 0)
        points = 0;


    if(points[uid] < amount){
        say = "gained";
        dif = amount - points[uid];
    }
    else if(points[uid] > amount) {
        say = "lost";
        dif = points[uid] - amount;
    } else {
        say = "gained";
	dif = amount - points[uid];
    }

    points[uid] = amount;

    json = JSON.stringify(points);

    fs.writeFile('points.json', json, 'utf8', function callback(){
        
        message.channel.send(`${(say == "gained") ? bot.emojis.find(emoji => emoji.name === "Pog") : bot.emojis.find(emoji => emoji.name === "PepeHands")} <@${message.member.id}> ${say} ${dif} points and now has ${points[uid]}!`);
    }); // write it back
}

function bet(points, uid, amount, message)
{
    amount = Math.ceil(amount);
    let won = (Math.round(Math.random(0, 1)) == 0) ? true : false;
    let toAdd = (!won) ? -(amount) : amount;
    let newAmount = points[uid] + toAdd;

    addPoints(points, uid, newAmount, message);
}

// On new message
bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm" || message.channel.id == 556854212018044940) return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let cmds = Array(
        `${prefix}bet`,
        `${prefix}register`,
        `${prefix}points`,
        `${prefix}work`
    );
    if(!message.content.includes(prefix)) return;
    if(!cmds.includes(cmd)) return message.channel.send(`<@${message.member.id}>, invalid command.`);
    fs.readFile('points.json', 'utf8', function readFileCallback(err, data){
        var points = JSON.parse(data);

        var keyCodes = {
            "all" : 1,
            "half" : 0.5,
            "1quarter" : 0.25,
            "2quarter" : 0.5,
            "3quarter" : 0.75
        }
        
        if(cmd === `${prefix}bet`)
        {
            if(messageArray[1] == null) return message.channel.send(`<@${message.member.id}>, the input you have put in is invalid.`);
            if(isNaN(messageArray[1]) && keyCodes[messageArray[1]] == null && !messageArray[1].includes("%")) return message.channel.send(`<@${message.member.id}>, the input you have put in is invalid.`);;
            if(points[message.member.id] == 0) return message.channel.send(`<@${message.member.id}>, you have no points!`);

            if(points[message.member.id] == null) return message.channel.send(`<@${message.member.id}>, you are not apart of the database yet! Register yourself by typing \`!register\`.`);
            
            
            messageArray[1] = messageArray[1].toLowerCase();

            if(messageArray[1].includes("%"))
            {
                let amount = messageArray[1].split("%");
                if(isNaN(amount[0])) return message.channel.send(`<@${message.member.id}>, the input you have put in is invalid.`);
                if(Math.ceil(amount[0]) > 100) return message.channel.send(`<@${message.member.id}>, the input you have put in is invalid.`);

                amountToBet = Math.ceil((Math.ceil(amount[0]) / 100) * points[message.member.id]);
            } else if(!isNaN(messageArray[1]))
            {
                if(messageArray[1] > points[message.member.id] || messageArray[1] < 0) return message.channel.send(`<@${message.member.id}>, you do not have enough points.`);
                amountToBet = Math.ceil(messageArray[1]);
            } else if(keyCodes[messageArray[1]] != null)
            {
                amountToBet = Math.ceil(keyCodes[messageArray[1]] * points[message.member.id]);
            }
            bet(points, message.member.id, amountToBet, message);


        } else if(cmd === `${prefix}register`)
        {
            if(points[message.member.id] != null) return message.channel.send(`<@${message.member.id}>, you are apart of the database already.`);

            obj = JSON.parse(data); //now it an object
            obj[message.member.id] = 5;
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('points.json', json, 'utf8', function callback(){
                message.member.addRole(message.guild.roles.get(Gamblers));
                message.channel.send(`<@${message.member.id}>, you are now apart of the database.`);
            }); // write it back
        } else if(cmd ===`${prefix}points` )
        {
	    if(points[message.member.id] == null) return message.channel.send(`<@${message.member.id}>, you are not apart of the database yet! Register yourself by typing \`!register\`.`);

            message.channel.send(`<@${message.member.id}> has ${points[message.member.id]} points.`);
        } else if(cmd === `${prefix}work`)
        {
            if(message.channel.id != 556819589447680011) return;
            if(points[message.member.id] == null) return message.channel.send(`<@${message.member.id}>, you are not apart of the database yet! Register yourself by typing \`!register\`.`);
            
            
            var gain = 5;
            points[message.member.id] += gain;
            json = JSON.stringify(points); //convert it back to json
            fs.writeFile('points.json', json, 'utf8', function callback(){
                message.channel.send(`<@${message.member.id}> went to work for ${gain} point, and now has ${points[message.member.id]} points.`);
            }); // write it back
        }
    });
});


bot.login(botconfig.token);

