const fs = require("fs");
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
    bot.channels.get("556871265894268978").send("Test").then((msg) => {
        function logEvery2Seconds(i) {
            setTimeout(() => {
        
                fs.readFile('points.json', 'utf8', function readFileCallback(err, data){
                    dict = JSON.parse(data);
                    
                      
                      // Create items array
                      var items = Object.keys(dict).map(function(key) {
                        return [key, dict[key]];
                      });
                      
                      // Sort the array based on the second element
                      items.sort(function(first, second) {
                        return second[1] - first[1];
                      });
                      
                      // Create a new array with only the first 5 items
                      leaderboard = items.slice(0, 20);
                      var trueLeaderboard = "```fix\n --TOP 20 GAMBLERS--";
                      for(var i in leaderboard)
                      {
                        var value = leaderboard[i];
                        var user = bot.users.get(`${value[0]}`);
                        trueLeaderboard += `\n ${parseInt(i) + 1}) ${user.username} with ${value[1]} points`;
                        
                        
                      }
                      trueLeaderboard += "```";
                      msg.edit(trueLeaderboard);
                });
        
                logEvery2Seconds(++i);
            }, 60000)
        }
        
        logEvery2Seconds(0);
        
        let i = 0;
        setInterval(() => {
            console.log('Infinite Loop Test interval n:', i++);
        }, 60000)
        
        
    });
});
bot.login(botconfig.token);