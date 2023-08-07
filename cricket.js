const axios = require('axios');
const TeleBot = require('telebot');
const bot = new TeleBot("XXX");

const URL = "https://1xbet.es/LiveFeed/Get1x2_VZip?sports=66&count=100&lng=es&mode=4&country=78&partner=229&getEmpty=true";

function getCricket () {
    axios.get(URL)
    .then(response => {
        let data = response.data.Value;
        let numOfGames = data.length;

        if (numOfGames == 0) {
            let noGamesText = "❌ NO LIVE GAMES";
            console.log(noGamesText);
            //bot.sendMessage(353166499, noGamesText);
        } else {
            let liveGamesText = "❕ GAMES COUNT: " + numOfGames;
            console.log(liveGamesText);
            for (i = 0; i <= numOfGames - 1; i++) {
                let gameId = data[i].I;
        
                const G_URL = "https://1xbet.es/LiveFeed/GetGameZip?id=" + gameId + "&lng=es&cfview=0&isSubGames=true&GroupEvents=true&allEventsGroupSubGames=true&countevents=250&partner=229";
        
                axios.get(G_URL)
                .then(response => {
                    let team1 = (response.data.Value.O1E).replace(/\s+/g, '-').toLowerCase();
                    let team2;
                    if (response.data.Value.O2E != undefined) {
                        team2 = (response.data.Value.O2E).replace(/\s+/g, '-').toLowerCase();
                    } else {
                        team2 = "";
                    }
                    let vs = (response.data.Value.LE).replace(/\s+/g, '-').toLowerCase();
    
                    let res = response.data.Value;
                    let champId = response.data.Value.LI;
                    let t1 = response.data.Value.O1E;
                    let t2 = response.data.Value.O2E;
    
                    let statsLength = (response.data.Value.SC.S).length;
        
                    for (j = 0; j <= statsLength - 1; j++) {
                        let key = res.SC.S[j].Key;
                        let value = res.SC.S[j].Value;
    
                        let shortValue = value.substring(0, 31);
    
                        if (key == "InningsStatistic" && value == '{"St":[]}') {
                            let textYes = ("✅ GAME FOUND \nTeams: " + t1 + " & " + t2 + "\n" + "Key: " + key + "\n" + "Value: " + value + "\n" +
                            "https://dev-web-obelis-platform.kube.test.obelis.lan/es/live/cricket/" + champId + "-" + vs + "/" + gameId + "-" + team1 + "-" + team2 + "");
                            bot.sendMessage(353166499, textYes);
                        } else if (key == "InningsStatistic" && value != '{"St":[]}') {
                            let textNo = "❌ NO SUITABLE GAMES - CURRENT GAMES DATA: \n" + shortValue + " ...";
                            console.log(textNo)
                        }
                    }
                })
            }

        }
    })
}
setInterval(getCricket, 30000)